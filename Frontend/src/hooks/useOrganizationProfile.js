import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { checkRegistrationStatus } from "../services/organizationApi";

const getStoredOrganizationCode = () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    return storedUser?.organizationCode || null;
  } catch {
    return null;
  }
};

export default function useOrganizationProfile({ skipToast = false } = {}) {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrganization = useCallback(async () => {
    const organizationCode = getStoredOrganizationCode();

    if (!organizationCode) {
      setError("Organization code missing from session");
      setOrganization(null);
      setLoading(false);
      if (!skipToast) {
        toast.error("Organization code missing. Please login again.");
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await checkRegistrationStatus(organizationCode);
      if (response.data?.success) {
        setOrganization(response.data.data);
      } else {
        setOrganization(null);
        const message = response.data?.message || "Failed to fetch organization";
        setError(message);
        if (!skipToast) toast.error(message);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Unable to load organization profile";
      setError(message);
      setOrganization(null);
      if (!skipToast) toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [skipToast]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    loading,
    error,
    refetchOrganization: fetchOrganization,
  };
}
