import { useMemo, useState } from "react";

const navItems = [
  { label: "Dashboard Overview", anchor: "overview" },
  { label: "Hospital Requests", anchor: "hospital-requests" },
  { label: "NGO Drives", anchor: "ngo-drives" },
  { label: "Blood Stock", anchor: "blood-stock" },
  { label: "Admin Messages", anchor: "admin-messages" },
  { label: "Profile & Settings", anchor: "profile-settings" },
];

const initialOverviewStats = {
  totalRequests: 18,
  pendingRequests: 3,
  completedSupplies: 15,
  upcomingNgoDrives: 2,
  verificationStatus: "VERIFIED",
};

const initialRequests = [
  {
    _id: "req001",
    hospitalName: "City Care Hospital",
    bloodGroup: "O+",
    unitsRequired: 3,
    urgency: "CRITICAL",
    status: "PENDING",
    requestedAt: "2025-12-27T08:30:00Z",
  },
  {
    _id: "req002",
    hospitalName: "LifeLine Hospital",
    bloodGroup: "A+",
    unitsRequired: 2,
    urgency: "HIGH",
    status: "ACCEPTED",
    requestedAt: "2025-12-26T15:10:00Z",
  },
  {
    _id: "req003",
    hospitalName: "Sunrise Multispeciality",
    bloodGroup: "B-",
    unitsRequired: 4,
    urgency: "MEDIUM",
    status: "PENDING",
    requestedAt: "2025-12-25T07:05:00Z",
  },
  {
    _id: "req004",
    hospitalName: "Hopewell Clinic",
    bloodGroup: "AB+",
    unitsRequired: 1,
    urgency: "LOW",
    status: "COMPLETED",
    requestedAt: "2025-12-20T10:45:00Z",
  },
  {
    _id: "req005",
    hospitalName: "Metro Heart Centre",
    bloodGroup: "O-",
    unitsRequired: 5,
    urgency: "CRITICAL",
    status: "PENDING",
    requestedAt: "2025-12-27T10:15:00Z",
  },
];

const initialNgoDrives = [
  {
    _id: "drive001",
    ngoName: "Red Drop Foundation",
    driveDate: "2025-12-30",
    location: "Ahmedabad",
    expectedUnits: 20,
    collectedUnits: 12,
    status: "APPROVED",
  },
  {
    _id: "drive002",
    ngoName: "Helping Hands NGO",
    driveDate: "2026-01-05",
    location: "Surat",
    expectedUnits: 15,
    collectedUnits: 0,
    status: "PENDING",
  },
  {
    _id: "drive003",
    ngoName: "Smile Trust",
    driveDate: "2025-12-28",
    location: "Vadodara",
    expectedUnits: 25,
    collectedUnits: 25,
    status: "COMPLETED",
  },
];

const bloodStockSnapshot = [
  { bloodGroup: "A+", units: 12, lastUpdated: "2 hours ago" },
  { bloodGroup: "B+", units: 8, lastUpdated: "1 day ago" },
  { bloodGroup: "O+", units: 5, lastUpdated: "30 minutes ago" },
  { bloodGroup: "AB-", units: 2, lastUpdated: "3 days ago" },
];

const adminSnapshot = {
  verificationStatus: "VERIFIED",
  lastVerifiedBy: "System Admin",
  message: "Your blood bank has been successfully verified.",
  verifiedAt: "2025-12-20",
};

const profileSnapshot = {
  name: "LifeCare Blood Bank",
  licenseNumber: "BB-GJ-2021-4455",
  email: "lifecare@bloodbank.com",
  phone: "+91 9876543210",
  city: "Ahmedabad",
  verificationStatus: "VERIFIED",
};

const statusBadgeStyles = {
  VERIFIED:
    "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3] shadow-[0_3px_12px_rgba(31,122,58,0.18)]",
  PENDING:
    "bg-[#fff3e4] text-[#b05f09] border border-[#f0c18c] shadow-[0_3px_12px_rgba(219,149,58,0.2)]",
  SUSPENDED:
    "bg-[#fde4e4] text-[#9e121c] border border-[#f5a5ad] shadow-[0_3px_12px_rgba(181,39,57,0.25)]",
  ACCEPTED: "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3]",
  REJECTED: "bg-[#fde4e4] text-[#9e121c] border border-[#f5a5ad]",
  COMPLETED: "bg-[#e7f3ff] text-[#185a9d] border border-[#b6d8f2]",
};

const urgencyBadgeStyles = {
  CRITICAL:
    "bg-linear-to-r from-[#8c111c]/20 to-[#c62832]/25 text-[#7c0d16] border border-[#f3a8b3]",
  HIGH: "bg-[#fff1e1] text-[#b35c12] border border-[#f6c898]",
  MEDIUM: "bg-[#fef6e0] text-[#9d7b08] border border-[#f3e3a2]",
  LOW: "bg-[#f3f0ea] text-[#6b5d55] border border-[#dcd2c6]",
};

const formatDate = (iso) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

const formatShortDate = (iso) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(new Date(iso));

const quickActions = [
  { label: "Create Request", icon: "🩸" },
  { label: "Log Supply", icon: "📦" },
  { label: "Schedule Drive", icon: "📅" },
];

export default function BloodBankDashboard() {
  const [requests, setRequests] = useState(initialRequests);
  const [requestStatusFilter, setRequestStatusFilter] = useState("ALL");
  const [requestUrgencyFilter, setRequestUrgencyFilter] = useState("ALL");
  const [ngoDrives, setNgoDrives] = useState(initialNgoDrives);
  const [driveStatusFilter, setDriveStatusFilter] = useState("ALL");
  const [adminLog] = useState(adminSnapshot);

  const actionsLocked = adminLog.verificationStatus !== "VERIFIED";

  const filteredRequests = useMemo(
    () =>
      requests.filter((req) => {
        const statusMatch =
          requestStatusFilter === "ALL" || req.status === requestStatusFilter;
        const urgencyMatch =
          requestUrgencyFilter === "ALL" || req.urgency === requestUrgencyFilter;
        return statusMatch && urgencyMatch;
      }),
    [requests, requestStatusFilter, requestUrgencyFilter]
  );

  const filteredDrives = useMemo(
    () =>
      ngoDrives.filter(
        (drive) =>
          driveStatusFilter === "ALL" || drive.status === driveStatusFilter
      ),
    [ngoDrives, driveStatusFilter]
  );

  const dashboardCards = [
    {
      title: "Total Hospital Requests",
      value: initialOverviewStats.totalRequests,
      meta: `${requests.length} active on desk`,
      accent: "from-[#7c0d16] to-[#b71d24]",
    },
    {
      title: "Pending Requests",
      value: initialOverviewStats.pendingRequests,
      meta: `${requests.filter((r) => r.status === "PENDING").length} awaiting action`,
      accent: "from-[#d1661c] to-[#f2994a]",
    },
    {
      title: "Completed Supplies",
      value: initialOverviewStats.completedSupplies,
      meta: `${requests.filter((r) => r.status === "COMPLETED").length} completed`,
      accent: "from-[#2c8a49] to-[#5ec271]",
    },
    {
      title: "Upcoming NGO Drives",
      value: initialOverviewStats.upcomingNgoDrives,
      meta: `${ngoDrives.filter((drive) => new Date(drive.driveDate) >= new Date()).length
        } scheduled`,
      accent: "from-[#1e5aa8] to-[#6fb1ff]",
    },
    {
      title: "Verification Status",
      value: adminLog.verificationStatus,
      meta: adminLog.lastVerifiedBy,
      accent: "from-[#d93f42] to-[#f08a8d]",
    },
  ];

  const handleRequestStatus = (id, nextStatus) => {
    setRequests((prev) =>
      prev.map((req) =>
        req._id === id
          ? {
              ...req,
              status: nextStatus,
            }
          : req
      )
    );
  };

  const handleDriveStatus = (id, nextStatus) => {
    setNgoDrives((prev) =>
      prev.map((drive) =>
        drive._id === id
          ? {
              ...drive,
              status: nextStatus,
            }
          : drive
      )
    );
  };

  const handleDriveCollection = (id, delta) => {
    setNgoDrives((prev) =>
      prev.map((drive) =>
        drive._id === id
          ? {
              ...drive,
              collectedUnits: Math.max(0, drive.collectedUnits + delta),
            }
          : drive
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#fff8f0] text-[#331c1b] font-['Nunito']">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex sticky top-0 h-screen w-80 shrink-0 flex-col gap-8 bg-linear-to-b from-[#5c0f14] via-[#75161d] to-[#9b1e27] px-8 py-10 text-white shadow-2xl">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              SEBN
            </p>
            <h1 className="mt-3 text-3xl font-semibold">Drop Bank</h1>
            <p className="text-sm text-white/80">Blood Bank Command Deck</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.anchor}
                href={`#${item.anchor}`}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold tracking-wide text-white/90 transition hover:bg-white/15"
              >
                {item.label}
                <span>↗</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl bg-white/15 p-5 backdrop-blur">
            <p className="text-sm text-white/80">Need escalation?</p>
            <p className="text-xl font-semibold">Control Room 24×7</p>
            <button className="mt-4 w-full rounded-full bg-white/90 py-3 text-sm font-semibold text-[#ff4d6d] transition hover:bg-white">
              Contact Admin
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-[#e0cfc7] bg-[#fffdfb]/90 px-4 py-5 backdrop-blur md:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                  {profileSnapshot.city}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold text-[#31101e]">
                    {profileSnapshot.name}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[adminLog.verificationStatus]
                      }`}
                  >
                    {adminLog.verificationStatus}
                  </span>
                </div>
                <p className="text-sm text-[#7c4a5e]">
                  Smart Emergency Blood Network • Blood Bank Role
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="rounded-full border border-pink-200 bg-white/70 px-6 py-2 text-sm font-semibold text-[#ff4d6d] shadow-[0_10px_30px_rgba(255,77,109,0.15)] transition hover:bg-white">
                  View Profile
                </button>
                <button className="rounded-full bg-linear-to-r from-[#ff4d6d] to-[#ff8fa3] px-6 py-2 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(255,77,109,0.35)] transition hover:scale-105">
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto text-xs font-semibold text-[#ff4d6d] lg:hidden">
              {navItems.map((item) => (
                <a
                  key={item.anchor}
                  href={`#${item.anchor}`}
                  className="rounded-full border border-pink-200/70 bg-white/60 px-4 py-2"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </header>

          <main className="flex-1 space-y-10 px-4 py-8 md:px-10">
            {adminLog.verificationStatus !== "VERIFIED" && (
              <div
                id="verification-alert"
                className={`rounded-3xl border px-6 py-4 text-sm font-semibold ${adminLog.verificationStatus === "SUSPENDED"
                    ? "border-[#ff4d6d]/40 bg-[#ffe2eb]"
                    : "border-[#f8c37b]/60 bg-[#fff5e7]"
                  }`}
              >
                {adminLog.verificationStatus === "SUSPENDED"
                  ? "Account suspended — operations locked until HQ reinstates the profile."
                  : "Verification pending — accepting requests and approving drives is paused."}
              </div>
            )}

            <section id="overview" className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                    Overview
                  </p>
                  <h3 className="text-3xl font-semibold text-[#31101e]">
                    Mission Control
                  </h3>
                  <p className="text-sm text-[#7c4a5e]">
                    Real-time intelligence synced with SEBN core.
                  </p>
                </div>
                <div className="flex gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-[#ff4d6d] shadow-[0_10px_25px_rgba(255,77,109,0.15)]"
                    >
                      <span className="text-lg">{action.icon}</span>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {dashboardCards.map((card) => (
                  <article
                    key={card.title}
                    className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_20px_50px_rgba(255,112,155,0.15)]"
                  >
                    <p className="text-xs uppercase tracking-[0.4em] text-[#7c4a5e]">
                      {card.title}
                    </p>
                    <h4
                      className={`mt-4 bg-linear-to-r ${card.accent} bg-clip-text text-4xl font-semibold text-transparent`}
                    >
                      {card.value}
                    </h4>
                    <p className="mt-2 text-sm text-[#7c4a5e]">{card.meta}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="hospital-requests"
              className="space-y-6 rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_25px_60px_rgba(241,122,146,0.18)]"
            >
              <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                    Hospital Blood Requests
                  </p>
                  <h3 className="text-2xl font-semibold text-[#31101e]">
                    Active Queue
                  </h3>
                  <p className="text-sm text-[#7c4a5e]">
                    Prioritize based on urgency and SLA commitments.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs font-semibold text-[#7c4a5e]">
                  <label className="flex items-center gap-2">
                    Status
                    <select
                      value={requestStatusFilter}
                      onChange={(e) => setRequestStatusFilter(e.target.value)}
                      className="rounded-full border border-pink-100 bg-white px-3 py-1 focus:border-[#ff4d6d]"
                    >
                      <option value="ALL">All</option>
                      <option value="PENDING">Pending</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-2">
                    Urgency
                    <select
                      value={requestUrgencyFilter}
                      onChange={(e) => setRequestUrgencyFilter(e.target.value)}
                      className="rounded-full border border-pink-100 bg-white px-3 py-1 focus:border-[#ff4d6d]"
                    >
                      <option value="ALL">All</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </label>
                </div>
              </header>

              {actionsLocked && (
                <p className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-700">
                  Controls locked until verification is completed.
                </p>
              )}

              <div className="overflow-x-auto rounded-2xl border border-pink-50">
                <table className="min-w-full text-left text-sm text-[#5c283a]">
                  <thead className="bg-pink-50/80 text-xs uppercase tracking-[0.3em] text-[#ff4d6d]">
                    <tr>
                      <th className="px-6 py-4">Hospital</th>
                      <th className="px-6 py-4">Blood Group</th>
                      <th className="px-6 py-4">Units</th>
                      <th className="px-6 py-4">Urgency</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Requested</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr
                        key={req._id}
                        className={`border-b border-pink-50 bg-white transition hover:bg-pink-50/60 ${req.urgency === "CRITICAL"
                            ? "border-l-4 border-l-[#ff4d6d]"
                            : "border-l-4 border-l-transparent"
                          }`}
                      >
                        <td className="px-6 py-4 font-semibold">{req.hospitalName}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-semibold text-[#ff4d6d]">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td className="px-6 py-4">{req.unitsRequired}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${urgencyBadgeStyles[req.urgency]
                              }`}
                          >
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[req.status] || "bg-pink-50"
                              }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#8a5c70]">
                          {formatDate(req.requestedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {req.status === "PENDING" && (
                              <>
                                <button
                                  disabled={actionsLocked}
                                  onClick={() =>
                                    handleRequestStatus(req._id, "ACCEPTED")
                                  }
                                  className="rounded-full border border-emerald-200 px-4 py-1 text-xs font-semibold text-[#1b8a4b] transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Accept
                                </button>
                                <button
                                  disabled={actionsLocked}
                                  onClick={() =>
                                    handleRequestStatus(req._id, "REJECTED")
                                  }
                                  className="rounded-full border border-[#f59ab3] px-4 py-1 text-xs font-semibold text-[#c5114d] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {req.status === "ACCEPTED" && (
                              <button
                                disabled={actionsLocked}
                                onClick={() =>
                                  handleRequestStatus(req._id, "COMPLETED")
                                }
                                className="rounded-full border border-[#9dd4ff] px-4 py-1 text-xs font-semibold text-[#0f6fa6] transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section
              id="ngo-drives"
              className="space-y-6 rounded-3xl border border-white/60 bg-white/90 p-6 shadow-[0_25px_60px_rgba(255,118,158,0.12)]"
            >
              <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                    NGO Donation Drives
                  </p>
                  <h3 className="text-2xl font-semibold text-[#31101e]">
                    Collaboration Pipeline
                  </h3>
                  <p className="text-sm text-[#7c4a5e]">
                    Approve drives, monitor collections, and close loops.
                  </p>
                </div>
                <label className="text-xs font-semibold text-[#7c4a5e]">
                  Status
                  <select
                    value={driveStatusFilter}
                    onChange={(e) => setDriveStatusFilter(e.target.value)}
                    className="ml-2 rounded-full border border-pink-100 bg-white px-3 py-1 focus:border-[#ff4d6d]"
                  >
                    <option value="ALL">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </label>
              </header>

              {actionsLocked && (
                <p className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-yellow-700">
                  Approval controls locked pending verification.
                </p>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {filteredDrives.map((drive) => (
                  <article
                    key={drive._id}
                    className="rounded-3xl border border-pink-50 bg-white p-5 shadow-[0_20px_45px_rgba(255,142,175,0.15)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-semibold text-[#31101e]">
                          {drive.ngoName}
                        </h4>
                        <p className="text-sm text-[#8a5c70]">
                          {drive.location} · {formatShortDate(drive.driveDate)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[drive.status] || "bg-pink-50"
                          }`}
                      >
                        {drive.status}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-pink-100 bg-pink-50/60 p-3">
                        <p className="text-[#ff4d6d]/80">Expected Units</p>
                        <p className="text-2xl font-semibold text-[#31101e]">
                          {drive.expectedUnits}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
                        <p className="text-[#1b8a4b]/70">Collected</p>
                        <p className="text-2xl font-semibold text-[#1b8a4b]">
                          {drive.collectedUnits}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3 text-xs font-semibold">
                      {drive.status === "PENDING" && (
                        <>
                          <button
                            disabled={actionsLocked}
                            onClick={() =>
                              handleDriveStatus(drive._id, "APPROVED")
                            }
                            className="rounded-full border border-emerald-200 px-4 py-2 text-[#1b8a4b] transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Approve
                          </button>
                          <button
                            disabled={actionsLocked}
                            onClick={() =>
                              handleDriveStatus(drive._id, "REJECTED")
                            }
                            className="rounded-full border border-[#f59ab3] px-4 py-2 text-[#c5114d] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {drive.status === "APPROVED" && (
                        <>
                          <button
                            disabled={actionsLocked}
                            onClick={() =>
                              handleDriveCollection(drive._id, 1)
                            }
                            className="rounded-full border border-pink-100 px-4 py-2 text-[#31101e] transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +1 Unit Collected
                          </button>
                          <button
                            disabled={actionsLocked}
                            onClick={() =>
                              handleDriveStatus(drive._id, "COMPLETED")
                            }
                            className="rounded-full border border-[#9dd4ff] px-4 py-2 text-[#0f6fa6] transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Mark Completed
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              id="blood-stock"
              className="rounded-3xl border border-white/70 bg-white p-6 shadow-[0_25px_55px_rgba(255,154,187,0.15)]"
            >
              <header className="mb-6">
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                  Blood Stock (Read Only)
                </p>
                <h3 className="text-2xl font-semibold text-[#31101e]">
                  Current Inventory
                </h3>
                <p className="text-sm text-[#7c4a5e]">
                  Updates coming in Phase 2. Monitor availability for requests.
                </p>
              </header>

              <div className="overflow-x-auto rounded-2xl border border-pink-50">
                <table className="min-w-full text-left text-sm text-[#5c283a]">
                  <thead className="bg-pink-50 text-xs uppercase tracking-[0.3em] text-[#ff4d6d]">
                    <tr>
                      <th className="px-6 py-4">Blood Group</th>
                      <th className="px-6 py-4">Units Available</th>
                      <th className="px-6 py-4">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bloodStockSnapshot.map((stock) => (
                      <tr key={stock.bloodGroup} className="border-b border-pink-50">
                        <td className="px-6 py-4 font-semibold">{stock.bloodGroup}</td>
                        <td className="px-6 py-4">{stock.units}</td>
                        <td className="px-6 py-4 text-xs text-[#8a5c70]">
                          {stock.lastUpdated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section
                id="admin-messages"
                className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_25px_60px_rgba(255,154,187,0.2)]"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                  Admin Messages & Verification
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#31101e]">
                  Compliance Console
                </h3>
                <p className="mt-1 text-sm text-[#7c4a5e]">
                  Last action from headquarters.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-pink-50 bg-pink-50/60 p-4">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#7c4a5e]">
                      Verification Status
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeStyles[adminLog.verificationStatus]
                          }`}
                      >
                        {adminLog.verificationStatus}
                      </span>
                      <p className="text-sm text-[#7c4a5e]">
                        Verified by {adminLog.lastVerifiedBy} on{" "}
                        {formatShortDate(adminLog.verifiedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-pink-100 bg-linear-to-br from-[#ffe5ec] to-[#fff5f9] p-5">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]/70">
                      Admin Notice
                    </p>
                    <p className="mt-3 text-lg font-semibold text-[#31101e]">
                      {adminLog.message}
                    </p>
                    <p className="mt-2 text-sm text-[#7c4a5e]">
                      The central control team monitors adherence to SEBN SOPs.
                      Non-compliance triggers automatic audits.
                    </p>
                  </div>
                </div>
              </section>

              <section
                id="profile-settings"
                className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_25px_60px_rgba(255,154,187,0.2)]"
              >
                <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]">
                  Profile & Settings
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-[#31101e]">
                  Blood Bank Identity
                </h3>
                <p className="mt-1 text-sm text-[#7c4a5e]">
                  Ensure contact and license details stay current.
                </p>

                <dl className="mt-6 space-y-4 border-t border-pink-50 pt-4 text-sm">
                  <div className="flex justify-between border-b border-pink-50 pb-3">
                    <dt className="text-[#7c4a5e]">License Number</dt>
                    <dd className="font-semibold text-[#31101e]">
                      {profileSnapshot.licenseNumber}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-pink-50 pb-3">
                    <dt className="text-[#7c4a5e]">Contact Email</dt>
                    <dd className="font-semibold text-[#31101e]">
                      {profileSnapshot.email}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-pink-50 pb-3">
                    <dt className="text-[#7c4a5e]">Phone</dt>
                    <dd className="font-semibold text-[#31101e]">
                      {profileSnapshot.phone}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#7c4a5e]">City</dt>
                    <dd className="font-semibold text-[#31101e]">
                      {profileSnapshot.city}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="flex-1 rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm font-semibold text-[#ff4d6d] transition hover:border-[#ff4d6d]">
                    Update Details
                  </button>
                  <button className="flex-1 rounded-2xl bg-linear-to-r from-[#ff4d6d] to-[#ff8fa3] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(255,77,109,0.35)] transition hover:scale-[1.02]">
                    Download Compliance PDF
                  </button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
