import { createContext, useContext, useMemo } from "react";
import useOrganizationProfile from "../hooks/useOrganizationProfile";

const BloodBankDashboardContext = createContext(null);

export function BloodBankDashboardProvider({ children }) {
  const profileState = useOrganizationProfile();

  const value = useMemo(
    () => ({
      organization: profileState.organization,
      organizationLoading: profileState.loading,
      organizationError: profileState.error,
      refetchOrganization: profileState.refetchOrganization,
    }),
    [
      profileState.organization,
      profileState.loading,
      profileState.error,
      profileState.refetchOrganization,
    ]
  );

  return (
    <BloodBankDashboardContext.Provider value={value}>
      {children}
    </BloodBankDashboardContext.Provider>
  );
}

export const useBloodBankDashboard = () => {
  const context = useContext(BloodBankDashboardContext);
  if (!context) {
    throw new Error(
      "useBloodBankDashboard must be used within BloodBankDashboardProvider"
    );
  }
  return context;
};
