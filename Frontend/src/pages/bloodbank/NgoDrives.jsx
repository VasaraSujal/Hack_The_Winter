import { useMemo, useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import toast from "react-hot-toast";
import {
  getHospitalNgoDrives,
  completeNgoDrive,
} from "../../services/hospitalNgoDriveApi";
import { getVerificationStatusLabel } from "../../utils/organizationStatus";
import CreateDriveRequestModal from "../../components/CreateDriveRequestModal";

const statusPills = {
  PENDING:
    "bg-[#fff3e4] text-[#b05f09] border border-[#f0c18c] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
  ACCEPTED:
    "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
  COMPLETED:
    "bg-[#e7f3ff] text-[#185a9d] border border-[#b6d8f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
  REJECTED:
    "bg-[#fde4e4] text-[#9e121c] border border-[#f5a5ad] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
  SCHEDULED:
    "bg-[#f1f5f9] text-[#475569] border border-[#cbd5f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]",
};

const formatDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
      }).format(new Date(iso))
    : "Date not set";

export default function NgoDrives() {
  const { organization, isVerified } = useOutletContext() || {};
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const organizationId =
    organization?._id ||
    JSON.parse(localStorage.getItem("user") || "{}")?.organizationId;

  const token = localStorage.getItem("token");
  const verificationStatus = getVerificationStatusLabel(organization);
  const actionsLocked = !isVerified;

  useEffect(() => {
    if (!organizationId || !token) return;
    fetchDrives();
  }, [organizationId, token]);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getHospitalNgoDrives(
        organizationId,
        { page: 1, limit: 100 },
        token
      );
      setDrives(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching NGO drives:", err);
      setError(err.response?.data?.message || "Failed to load NGO drives");
    } finally {
      setLoading(false);
    }
  };

  const filteredDrives = useMemo(
    () =>
      drives.filter(
        (drive) => filter === "ALL" || drive.status === filter
      ),
    [drives, filter]
  );

  const handleMarkCompleted = async (driveId) => {
    try {
      await completeNgoDrive(
        driveId,
        {
          completedBy: organizationId,
          actualDonors: 0,
          remarks: "Drive marked complete from dashboard",
        },
        token
      );
      toast.success("Drive marked as completed");
      fetchDrives();
    } catch (err) {
      console.error("Error completing drive:", err);
      toast.error(
        err.response?.data?.message || "Failed to mark drive completed"
      );
    }
  };

  if (!organizationId) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-lg">
        <p className="text-sm font-semibold text-[#9e121c]">
          Organization details missing. Please log in again.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#ff4d6d] border-r-transparent" />
          <p className="text-sm font-medium text-[#7c4a5e]">
            Syncing NGO drives with SEBN...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white p-6 shadow-lg">
        <div className="rounded-2xl border border-[#f5a5ad] bg-[#fde4e4] p-6 text-center">
          <p className="text-lg font-semibold text-[#9e121c]">Error Loading Drives</p>
          <p className="mt-2 text-sm text-[#7c4a5e]">{error}</p>
          <button
            onClick={fetchDrives}
            className="mt-4 rounded-full bg-[#ff4d6d] px-6 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(255,77,109,0.3)] transition hover:bg-[#e0435f]"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-white/80 bg-white p-6 shadow-[0_25px_60px_rgba(241,122,146,0.18)]">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
            NGO Donation Drives
          </p>
          <h2 className="text-2xl font-semibold text-[#31101e]">
            {organization?.name || "NGO Collaborations"}
          </h2>
          <p className="text-sm text-[#7c4a5e]">
            Partner with trusted NGOs to maintain critical reserves.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#7c4a5e]">
          <label className="flex items-center gap-2">
            Status
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-full border border-pink-100 bg-white px-3 py-1 focus:border-[#ff4d6d]"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
          <button
            disabled={actionsLocked}
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-gradient-to-r from-[#8f0f1a] to-[#c62832] px-5 py-2 text-xs font-semibold text-white shadow-[0_15px_35px_rgba(143,15,26,0.25)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + New Drive Request
          </button>
        </div>
      </header>

      {!isVerified && (
        <p className="rounded-2xl border border-[#f0c18c] bg-[#fff3e4] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#b05f09]">
          Drive creation disabled until verification completes.
        </p>
      )}

      {filteredDrives.length === 0 ? (
        <div className="rounded-2xl border border-pink-50 bg-pink-50/60 p-10 text-center">
          <p className="text-sm font-semibold text-[#7c4a5e]">
            {filter !== "ALL"
              ? "No drives match this filter."
              : "No NGO drives logged yet. Start by creating a request."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredDrives.map((drive) => (
            <article
              key={drive._id}
              className="rounded-2xl border border-white/70 bg-white p-5 shadow-[0_15px_40px_rgba(255,77,109,0.12)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-[#31101e]">
                    {drive.driveTitle || "Blood Donation Drive"}
                  </h4>
                  <p className="text-sm text-[#7c4a5e]">
                    {drive.ngoId?.name || "NGO Partner"} • {formatDate(drive.driveDate)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusPills[drive.status] || statusPills.PENDING
                  }`}
                >
                  {drive.status}
                </span>
              </div>

              <div className="mt-4 grid gap-4 rounded-xl border border-pink-50 bg-pink-50/40 p-4 text-sm text-[#5c283a] sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#ff4d6d]">
                    Expected Donors
                  </p>
                  <p className="text-2xl font-semibold text-[#31101e]">
                    {drive.expectedDonors || drive.expectedUnits || 0}
                  </p>
                </div>
                {drive.actualDonors > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#1f7a3a]">
                      Actual Donors
                    </p>
                    <p className="text-2xl font-semibold text-[#1f7a3a]">
                      {drive.actualDonors}
                    </p>
                  </div>
                )}
              </div>

              {drive.location?.venueName && (
                <p className="mt-3 text-xs text-[#7c4a5e]">
                  <strong>Venue:</strong> {drive.location.venueName},{" "}
                  {drive.location.city || organization?.address?.city || "City TBD"}
                </p>
              )}

              {drive.hospitalNotes && (
                <p className="mt-2 text-xs text-[#7c4a5e]">
                  <strong>Notes:</strong> {drive.hospitalNotes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                {drive.status === "ACCEPTED" && (
                  <button
                    disabled={actionsLocked}
                    onClick={() => handleMarkCompleted(drive._id)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark Completed
                  </button>
                )}
                {drive.status === "PENDING" && (
                  <span className="rounded-full bg-[#fff3e4] px-4 py-2 text-[#b05f09]">
                    Awaiting NGO confirmation
                  </span>
                )}
                {drive.status === "COMPLETED" && (
                  <span className="rounded-full bg-[#ecf8ef] px-4 py-2 text-[#1f7a3a]">
                    ✓ Drive Completed
                  </span>
                )}
                {drive.status === "REJECTED" && (
                  <span className="rounded-full bg-[#fde4e4] px-4 py-2 text-[#9e121c]">
                    Declined by NGO
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <CreateDriveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDrives}
        hospitalId={organizationId}
        organization={organization}
      />
    </section>
  );
}
