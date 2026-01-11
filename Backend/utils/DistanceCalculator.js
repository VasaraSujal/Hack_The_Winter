/**
 * Distance Calculator Utility
 * Calculates distance between two geographical coordinates using Haversine formula
 */

class DistanceCalculator {
    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {Object} coord1 - First coordinate {latitude, longitude} or {coordinates: [lng, lat]}
     * @param {Object} coord2 - Second coordinate {latitude, longitude} or {coordinates: [lng, lat]}
     * @returns {Object} - Distance in kilometers and miles
     */
    static calculateDistance(coord1, coord2) {
        // Extract coordinates
        let lat1, lon1, lat2, lon2;

        // Handle GeoJSON format: {type: "Point", coordinates: [longitude, latitude]}
        if (coord1.coordinates && Array.isArray(coord1.coordinates)) {
            lon1 = coord1.coordinates[0];
            lat1 = coord1.coordinates[1];
        } else {
            lat1 = coord1.latitude;
            lon1 = coord1.longitude;
        }

        if (coord2.coordinates && Array.isArray(coord2.coordinates)) {
            lon2 = coord2.coordinates[0];
            lat2 = coord2.coordinates[1];
        } else {
            lat2 = coord2.latitude;
            lon2 = coord2.longitude;
        }

        // Validate coordinates
        if (!this.isValidCoordinate(lat1, lon1) || !this.isValidCoordinate(lat2, lon2)) {
            throw new Error("Invalid coordinates provided");
        }

        // Haversine formula
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
            Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distanceKm = R * c;

        return {
            kilometers: parseFloat(distanceKm.toFixed(2)),
            miles: parseFloat((distanceKm * 0.621371).toFixed(2)),
            meters: parseFloat((distanceKm * 1000).toFixed(2))
        };
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees
     * @returns {number}
     */
    static toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Validate coordinate values
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {boolean}
     */
    static isValidCoordinate(lat, lon) {
        return (
            typeof lat === "number" &&
            typeof lon === "number" &&
            lat >= -90 &&
            lat <= 90 &&
            lon >= -180 &&
            lon <= 180 &&
            !(lat === 0 && lon === 0) // Exclude default [0, 0] coordinates
        );
    }

    /**
     * Format distance for display
     * @param {Object} distance - Distance object from calculateDistance
     * @returns {string}
     */
    static formatDistance(distance) {
        if (distance.kilometers < 1) {
            return `${distance.meters} meters`;
        } else if (distance.kilometers < 10) {
            return `${distance.kilometers} km`;
        } else {
            return `${distance.kilometers} km (${distance.miles} miles)`;
        }
    }

    /**
     * Get distance category based on kilometers
     * @param {number} kilometers
     * @returns {string}
     */
    static getDistanceCategory(kilometers) {
        if (kilometers < 5) return "VERY_CLOSE";
        if (kilometers < 15) return "CLOSE";
        if (kilometers < 30) return "MODERATE";
        if (kilometers < 50) return "FAR";
        return "VERY_FAR";
    }
}

export default DistanceCalculator;
