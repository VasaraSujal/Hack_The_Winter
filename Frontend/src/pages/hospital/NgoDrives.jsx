import { useMemo, useState, useEffect } from "react";
import {
  getHospitalNgoDrives,
  completeNgoDrive
} from "../../services/hospitalNgoDriveApi";
import { getHospitalById } from "../../services/hospitalApi";

import CreateDriveRequestModal from "../../components/CreateDriveRequestModal";

const statusPills = {
  PENDING: "bg-[#fff3e4] text-[#b05f09] border border-[#f0c18c]",
  ACCEPTED: "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3]",
  COMPLETED: "bg-[#e7f3ff] text-[#185a9d] border border-[#b6d8f2]",
  REJECTED: "bg-[#fde4e4] text-[#9e121c] border border-[#f5a5ad]",
  SCHEDULED: "bg-[#e2e8f0] text-[#475569] border border-[#cbd5e1]",
};

const formatDate = (iso) => {
  if (!iso) return 'Date not set';
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(iso));
};

export default function HospitalNgoDrives() {
  const [drives, setDrives] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [verificationStatus, setVerificationStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get auth data from localStorage
  const token = localStorage.getItem('token');
  const organizationId = localStorage.getItem('organizationId'); // Organization ID from login

  // TEMPORARY FIX: Debugging unlock
  // const actionsLocked = verificationStatus !== "VERIFIED";
  const actionsLocked = false; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch hospital details for verification status
      const hospitalResponse = await getHospitalById(organizationId);
      setVerificationStatus(hospitalResponse.data.data.verificationStatus);

      // Fetch NGO drives
      const drivesResponse = await getHospitalNgoDrives(
        organizationId,
        { page: 1, limit: 100 },
        token
      );

      setDrives(drivesResponse.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching NGO drives:', err);
      setError(err.response?.data?.message || 'Failed to load NGO drives');
      setLoading(false);
    }
  };

  const filtered = useMemo(
    () =>
      drives.filter(
        (drive) => filter === "ALL" || drive.status === filter
      ),
    [drives, filter]
  );

  const handleStatusUpdate = async (id, nextStatus) => {
    try {
      if (nextStatus === 'COMPLETED') {
        await completeNgoDrive(
          id,
          { 
            completedBy: organizationId, 
            actualDonors: 0, // You can add a form to get actual donors
            remarks: 'Drive completed successfully' 
          },
          token
        );
      }

      // Refresh data
      await fetchData();
    } catch (err) {
      console.error('Error updating drive:', err);
      alert(err.response?.data?.message || 'Failed to update drive');
    }
  };

  if (loading) {
    return (
      <section className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_25px_60px_rgba(77,10,15,0.12)]">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#8f0f1a] border-r-transparent"></div>
            <p className="mt-4 text-sm text-[#7a4c4c]">Loading NGO drives...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_25px_60px_rgba(77,10,15,0.12)]">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-lg font-semibold text-red-800">Error Loading Drives</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_25px_60px_rgba(77,10,15,0.12)]">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#8f0f1a]">
            NGO Donation Drives
          </p>
          <h3 className="text-2xl font-semibold text-[#2f1012]">
            Collaborative Drives
          </h3>
          <p className="text-sm text-[#7a4c4c]">
            Partner with trusted NGOs to maintain critical reserves.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#7a4c4c]">
          <label className="flex items-center gap-2">
            Status
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-full border border-[#f3c9c0] bg-white px-3 py-1 focus:border-[#8f0f1a]"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="COMPLETED">Completed</option>
              {/* <option value="REJECTED">Rejected</option> */}
            </select>
          </label>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={actionsLocked}
            className="rounded-full bg-linear-to-r from-[#8f0f1a] to-[#c62832] px-5 py-2 text-xs font-semibold text-white shadow-[0_15px_35px_rgba(143,15,26,0.25)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + New Drive Request
          </button>
        </div>
      </header>

      {actionsLocked && (
        <p className="rounded-2xl border border-[#f0c18c] bg-[#fff3e4] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#b05f09]">
          Drive creation disabled until verification completes.
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#f6ddd4] bg-white p-12 text-center">
          <p className="text-sm text-[#7a4c4c]">No NGO drives found</p>
          <p className="mt-1 text-xs text-[#8b6161]">
            {filter !== "ALL" 
              ? "Try adjusting your filter" 
              : "Create your first NGO drive to get started"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((drive) => (
            <article
              key={drive._id}
              className="rounded-2xl border border-[#f6ddd4] bg-[#fff9f6] p-5 shadow-[0_20px_45px_rgba(77,10,15,0.08)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-[#2f1012]">
                    {drive.driveTitle || drive.driveName || "Blood Donation Drive"}
                  </h4>
                  <p className="text-sm text-[#7a4c4c]">
                    {drive.ngoId?.name || drive.ngoId || "NGO"} • {formatDate(drive.driveDate)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusPills[drive.status] || "bg-[#f6ddd4]"
                  }`}
                >
                  {drive.status}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm text-[#553334]">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8f0f1a]">
                    Expected Donors
                  </p>
                  <p className="text-2xl font-semibold text-[#2f1012]">
                    {drive.expectedDonors || 0}
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

              {drive.description && (
                <p className="mt-3 text-xs text-[#8b6161]">
                  <strong>Description:</strong> {drive.description}
                </p>
              )}
                {drive.location && (
                <p className="mt-1 text-xs text-[#8b6161]">
                  <strong>Location:</strong> {drive.location.venueName}, {drive.location.city}
                </p>
              )}


              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                {drive.status === "ACCEPTED" && (
                  <button
                    disabled={actionsLocked}
                    onClick={() => handleStatusUpdate(drive._id, "COMPLETED")}
                    className="rounded-full border border-[#b6d8f2] px-4 py-2 text-[#185a9d] transition hover:bg-[#e7f3ff] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Mark Completed
                  </button>
                )}
                {drive.status === "PENDING" && (
                  <span className="text-[#b05f09]">Awaiting NGO confirmation</span>
                )}
                {drive.status === "COMPLETED" && (
                  <span className="text-[#185a9d]">✓ Drive Completed</span>
                )}
                {drive.status === "REJECTED" && (
                  <span className="text-[#9e121c]">Declined by NGO</span>
                )}
                  {drive.status === "SCHEDULED" && (
                  <span className="text-[#475569]">Scheduled</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    
    <CreateDriveRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        hospitalId={organizationId}
    />
    </section>
  );
}
