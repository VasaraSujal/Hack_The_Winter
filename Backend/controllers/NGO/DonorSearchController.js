import { DonorCollection } from "../../models/donor/Donor.js";
import { getDB } from "../../config/db.js";

const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

const sendError = (res, message = "An error occurred", statusCode = 500) => {
    res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};

/**
 * SEARCH DONORS BY CITY (NGO only)
 * Searches in both donors collection and campRegistrations collection
 */
export const searchDonorsByCity = async (req, res) => {
    try {
        const { city } = req.query;

        if (!city || city.trim().length === 0) {
            return sendError(res, "City parameter is required", 400);
        }

        const db = getDB();

        // Search in donors collection (direct registrations)
        const directDonors = await DonorCollection()
            .find({
                city: { $regex: new RegExp(city, "i") }
            })
            .toArray();

        // Search in campRegistrations collection (camp-wise registrations)
        const campRegistrations = await db.collection("campRegistrations")
            .find({
                city: { $regex: new RegExp(city, "i") }
            })
            .toArray();

        // Mark the source of each donor
        const directDonorsWithSource = directDonors.map(donor => ({
            ...donor,
            source: "direct",
            registrationType: donor.registrationType || "direct"
        }));

        const campDonorsWithSource = campRegistrations.map(reg => ({
            ...reg,
            source: "camp",
            registrationType: reg.registrationType || "camp"
        }));

        // Merge both results
        const allDonors = [...directDonorsWithSource, ...campDonorsWithSource];

        console.log(`[DONOR_SEARCH] Found ${directDonors.length} direct donors and ${campRegistrations.length} camp registrations in ${city}`);

        sendSuccess(res, allDonors, `Found ${allDonors.length} donor(s) in ${city}`);
    } catch (error) {
        console.error("Search donors by city error:", error);
        sendError(res, "Failed to search donors", 500);
    }
};
