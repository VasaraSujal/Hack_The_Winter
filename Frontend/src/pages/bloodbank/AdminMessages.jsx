import { useOutletContext } from "react-router-dom";
import {
  getVerificationDetails,
  getVerificationStatusLabel,
} from "../../utils/organizationStatus";

const statusBadgeStyles = {
  VERIFIED:
    "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3] shadow-[0_3px_12px_rgba(31,122,58,0.18)]",
  APPROVED:
    "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3] shadow-[0_3px_12px_rgba(31,122,58,0.18)]",
  ACTIVE:
    "bg-[#ecf8ef] text-[#1f7a3a] border border-[#a2d8b3] shadow-[0_3px_12px_rgba(31,122,58,0.18)]",
  PENDING:
    "bg-[#fff3e4] text-[#b05f09] border border-[#f0c18c] shadow-[0_3px_12px_rgba(219,149,58,0.2)]",
  SUSPENDED:
    "bg-[#fde4e4] text-[#9e121c] border border-[#f5a5ad] shadow-[0_3px_12px_rgba(181,39,57,0.25)]",
};

const formatShortDate = (iso) =>
  iso
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
      }).format(new Date(iso))
    : "--";

export default function AdminMessages() {
  const { organization } = useOutletContext() || {};
  const verificationDetails = getVerificationDetails(organization);
  const statusLabel = getVerificationStatusLabel(organization);
  const timeline = [
    {
      title:
        statusLabel === "SUSPENDED" ? "Account Suspended" : "Account Verified",
      description:
        statusLabel === "SUSPENDED"
          ? verificationDetails.notice
          : "System Admin approved your registration",
      date: verificationDetails.verifiedAt,
    },
    {
      title: "Profile Updated",
      description: "Contact information synchronized",
      date: organization?.updatedAt,
    },
    {
      title: "Registration Submitted",
      description: "Initial application received",
      date: organization?.createdAt,
    },
  ];

  return (
    <section className="rounded-3xl border border-white/60 bg-white p-6 shadow-[0_25px_60px_rgba(255,154,187,0.2)]">
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
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusBadgeStyles[statusLabel] || statusBadgeStyles.PENDING
              }`}
            >
              {statusLabel}
            </span>
            <p className="text-sm text-[#7c4a5e]">
              Verified by {verificationDetails.verifiedBy} on{" "}
              {formatShortDate(verificationDetails.verifiedAt)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-[#ffe5ec] to-[#fff5f9] p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[#ff4d6d]/70">
            Admin Notice
          </p>
          <p className="mt-3 text-lg font-semibold text-[#31101e]">
            {verificationDetails.notice}
          </p>
          <p className="mt-2 text-sm text-[#7c4a5e]">
            The central control team monitors adherence to SEBN SOPs.
            Non-compliance triggers automatic audits.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[#1b8a4b]/70">
            System Guidelines
          </p>
          <ul className="mt-3 space-y-2 text-sm text-[#31101e]">
            <li className="flex items-start gap-2">
              <span className="text-[#1b8a4b]">✓</span>
              <span>Respond to critical requests within 30 minutes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1b8a4b]">✓</span>
              <span>Update blood stock inventory daily</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1b8a4b]">✓</span>
              <span>Approve or reject NGO drives within 48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#1b8a4b]">✓</span>
              <span>Maintain accurate contact information</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[#185a9d]/70">
            Recent Activity Log
          </p>
          <div className="mt-3 space-y-3">
            {timeline.map((event, idx) => (
              <div
                key={event.title}
                className={`flex items-center justify-between ${
                  idx !== timeline.length - 1 ? "border-b border-blue-100 pb-2" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-[#31101e]">
                    {event.title}
                  </p>
                  <p className="text-xs text-[#7c4a5e]">{event.description}</p>
                </div>
                <p className="text-xs text-[#8a5c70]">
                  {formatShortDate(event.date)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
