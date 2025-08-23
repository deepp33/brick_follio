import express from "express";
import { Project } from "../models/index.js";
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const marketOverview = {
      metrics: {
        averageROI: "8.2%",
        yearlyROIChange: "+0.5%",
        priceGrowth: "12.3%",
        priceYoYChange: "+2.1%",
        rentalYield: "6.8%",
        rentalYieldChange: "-0.2%",
        marketVolume: "AED 45.2B",
        totalTransactionVolumeChange: "+8.7%",
      },
      topPerformingAreas: [
        { area: "Dubai Hills", growth: "+15.2%" },
        { area: "Business Bay", growth: "+12.8%" },
        { area: "Dubai Marina", growth: "+11.4%" },
        { area: "Downtown", growth: "+9.7%" },
      ],
      investmentTrends: [
        { type: "Apartments", percentage: "65%" },
        { type: "Villas", percentage: "25%" },
        { type: "Commercial", percentage: "10%" },
      ],
      reportLink: "Explore Market Reports",
    };

    res.status(200).json({
      success: true,
      data: marketOverview,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const projects = await Project.find();

    if (!projects.length) {
      return res.status(200).json({
        success: true,
        filters: {
          timeHorizon: { options: ["Current Week"], selected: "Current Month" },
          regions: [],
          propertyTypes: [],
          roiRange: { min: 0, max: 100, selectedMin: 0, selectedMax: 100 },
          rentalYieldRange: {
            min: 0,
            max: 100,
            selectedMin: 0,
            selectedMax: 100,
          },
          priceGrowthRange: {
            min: 0,
            max: 30,
            selectedMin: 0,
            selectedMax: 30,
          },
        },
      });
    }

    // Sets for unique values
    const regionsSet = new Set();
    const propertyTypesSet = new Set();
    let minROI = Infinity,
      maxROI = -Infinity;
    let minRentalYield = Infinity,
      maxRentalYield = -Infinity;
    let minPriceGrowth = Infinity,
      maxPriceGrowth = -Infinity;

    // Determine earliest and latest project creation date
    let earliestDate = new Date();
    let latestDate = new Date(0);

    projects.forEach((p) => {
      // Regions
      if (p.location) regionsSet.add(p.location);

      // Property Types
      if (p.category && p.category.length)
        p.category.forEach((c) => propertyTypesSet.add(c));

      // ROI
      if (typeof p.roi === "number") {
        minROI = Math.min(minROI, p.roi);
        maxROI = Math.max(maxROI, p.roi);
      }

      // Rental Yield
      if (typeof p.rentalYield === "number") {
        minRentalYield = Math.min(minRentalYield, p.rentalYield);
        maxRentalYield = Math.max(maxRentalYield, p.rentalYield);
      }

      // Price Growth
      if (typeof p.priceGrowth === "number") {
        minPriceGrowth = Math.min(minPriceGrowth, p.priceGrowth);
        maxPriceGrowth = Math.max(maxPriceGrowth, p.priceGrowth);
      }

      // Project dates for time horizon
      const createdAt = p.createdAt || new Date();
      if (createdAt < earliestDate) earliestDate = createdAt;
      if (createdAt > latestDate) latestDate = createdAt;
    });

    // Time Horizon options based on project age
    const diffDays = Math.ceil(
      (latestDate - earliestDate) / (1000 * 60 * 60 * 24)
    );
    let timeHorizonOptions = [];
    if (diffDays > 90) timeHorizonOptions.push("Last 3 Year");
    if (diffDays > 30) timeHorizonOptions.push("Last 1 Year");
    if (diffDays > 7) timeHorizonOptions.push("Last 6 Month");
    if (!timeHorizonOptions.length) timeHorizonOptions.push("Current Week");

    const filters = {
      timeHorizon: { options: timeHorizonOptions },
      regions: Array.from(regionsSet),
      propertyTypes: Array.from(propertyTypesSet),
      roiRange: {
        min: minROI !== Infinity ? minROI : 0,
        max: maxROI !== -Infinity ? maxROI : 100,
        selectedMin: minROI !== Infinity ? minROI : 0,
        selectedMax: maxROI !== -Infinity ? maxROI : 100,
      },
      rentalYieldRange: {
        min: minRentalYield !== Infinity ? minRentalYield : 0,
        max: maxRentalYield !== -Infinity ? maxRentalYield : 100,
        selectedMin: minRentalYield !== Infinity ? minRentalYield : 0,
        selectedMax: maxRentalYield !== -Infinity ? maxRentalYield : 100,
      },
      priceGrowthRange: {
        min: minPriceGrowth !== Infinity ? minPriceGrowth : 0,
        max: maxPriceGrowth !== -Infinity ? maxPriceGrowth : 30,
        selectedMin: minPriceGrowth !== Infinity ? minPriceGrowth : 0,
        selectedMax: maxPriceGrowth !== -Infinity ? maxPriceGrowth : 30,
      },
    };

    res.status(200).json({ success: true, filters });
  } catch (err) {
    console.error("Error fetching filters:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/overview", async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    const currentYear = now.getFullYear();

    // Total Properties
    const totalProperties = await Project.countDocuments();

    // Total Properties last month (approximate by completion date month)
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const totalLastMonth = await Project.countDocuments({
      "completion.year": lastMonthYear,
      "completion.quarter": `Q${Math.floor(lastMonth / 3) + 1}`,
    });
    const totalPropertiesChange =
      totalLastMonth > 0
        ? ((totalProperties - totalLastMonth) / totalLastMonth) * 100
        : 0;

    // Average ROI
    const roiStats = await Project.aggregate([
      { $match: { roi: { $exists: true } } },
      { $group: { _id: null, avgROI: { $avg: "$roi" } } },
    ]);
    const averageROI = roiStats[0]?.avgROI || 0;

    // Average ROI last quarter
    const lastQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
    const lastQuarterYear =
      currentQuarter === 1 ? currentYear - 1 : currentYear;
    const roiLastQuarterStats = await Project.aggregate([
      {
        $match: {
          "completion.year": lastQuarterYear,
          "completion.quarter": `Q${lastQuarter}`,
        },
      },
      { $group: { _id: null, avgROI: { $avg: "$roi" } } },
    ]);
    const roiChange = roiLastQuarterStats[0]?.avgROI
      ? averageROI - roiLastQuarterStats[0].avgROI
      : 0;

    // Average Rental Yield
    const rentalStats = await Project.aggregate([
      { $match: { rentalYield: { $exists: true } } },
      { $group: { _id: null, avgRentalYield: { $avg: "$rentalYield" } } },
    ]);
    const averageRentalYield = rentalStats[0]?.avgRentalYield || 0;

    // Average Rental Yield last year
    const rentalLastYearStats = await Project.aggregate([
      { $match: { "completion.year": currentYear - 1 } },
      { $group: { _id: null, avgRentalYield: { $avg: "$rentalYield" } } },
    ]);
    const rentalYieldChange = rentalLastYearStats[0]?.avgRentalYield
      ? averageRentalYield - rentalLastYearStats[0].avgRentalYield
      : 0;

    // Market Growth YoY (based on price.value)
    const currentYearStats = await Project.aggregate([
      { $match: { "completion.year": currentYear } },
      { $group: { _id: null, avgPrice: { $avg: "$price.value" } } },
    ]);
    const lastYearStats = await Project.aggregate([
      { $match: { "completion.year": currentYear - 1 } },
      { $group: { _id: null, avgPrice: { $avg: "$price.value" } } },
    ]);

    const marketGrowth =
      currentYearStats[0]?.avgPrice && lastYearStats[0]?.avgPrice
        ? ((currentYearStats[0].avgPrice - lastYearStats[0].avgPrice) /
            lastYearStats[0].avgPrice) *
          100
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProperties: totalProperties || 0,
        totalPropertiesChange: `${
          parseFloat(totalPropertiesChange.toFixed(2)) || 0
        }%`,
        averageROI: parseFloat(averageROI.toFixed(2)) || 0,
        roiChange: `${parseFloat(roiChange.toFixed(2)) || 0}%`,
        averageRentalYield: parseFloat(averageRentalYield.toFixed(2)) || 0,
        rentalYieldChange: `${parseFloat(rentalYieldChange.toFixed(2)) || 0}%`,
        marketGrowth: parseFloat(marketGrowth.toFixed(2)) || 0,
      },
    });
  } catch (err) {
    console.error("Error fetching market overview:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/trends", async (req, res) => {
  try {
    const { timeHorizon, regions = [], propertyTypes = [], roiRange, rentalYieldRange } = req.body;

    // Build query
    const query = {};
    if (regions.length) query.location = { $in: regions };
    if (propertyTypes.length) query.amenities = { $in: propertyTypes };
    if (roiRange?.min || roiRange?.max) query.roi = {};
    if (roiRange?.min) query.roi.$gte = roiRange.min;
    if (roiRange?.max) query.roi.$lte = roiRange.max;
    if (rentalYieldRange?.min || rentalYieldRange?.max) query.rentalYield = {};
    if (rentalYieldRange?.min) query.rentalYield.$gte = rentalYieldRange.min;
    if (rentalYieldRange?.max) query.rentalYield.$lte = rentalYieldRange.max;

    // Last 6 months calculation
    const now = new Date();
    const monthNames = [];
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - 5);
    pastDate.setDate(1);
    for (let i = 0; i < 6; i++) {
      const month = new Date(pastDate.getFullYear(), pastDate.getMonth() + i, 1);
      monthNames.push(month.toLocaleString("default", { month: "short" }));
    }
    query.updatedAt = { $gte: pastDate, $lte: now };

    const projects = await Project.find(query);

    // --- ROI Trends by Area (monthly) ---
    const roiMap = {};
    projects.forEach(p => {
      const month = p.updatedAt.toLocaleString("default", { month: "short" });
      if (!roiMap[p.location]) roiMap[p.location] = {};
      if (!roiMap[p.location][month]) roiMap[p.location][month] = { sum: 0, count: 0 };
      roiMap[p.location][month].sum += p.roi || 0;
      roiMap[p.location][month].count += 1;
    });

    const locations = [...new Set(projects.map(p => p.location))];
    const roiTrendsByArea = { options: [], months: monthNames };
    locations.forEach(loc => {
      const roiValues = monthNames.map(m => (roiMap[loc] && roiMap[loc][m] ? (roiMap[loc][m].sum / roiMap[loc][m].count).toFixed(1) : "0.0"));
      roiTrendsByArea.options.push({ location: loc, roi: roiValues });
    });

    // --- Rental Yield by Area (single value) ---
    const rentalMap = {};
    projects.forEach(p => {
      if (!rentalMap[p.location]) rentalMap[p.location] = { sum: 0, count: 0 };
      rentalMap[p.location].sum += p.rentalYield || 0;
      rentalMap[p.location].count += 1;
    });

    const rentalYieldByArea = [];
    Object.keys(rentalMap).forEach(loc => {
      const { sum, count } = rentalMap[loc];
      rentalYieldByArea.push({
        location: loc,
        rentalYield: (sum / count).toFixed(1),
        properties: count
      });
    });

    // --- Transaction Volumes by Amenity ---
    const allAmenities = propertyTypes.length ? propertyTypes : [...new Set(projects.flatMap(p => p.amenities || []))];
    const transactionVolumes = { options: allAmenities, Month: {} };
    monthNames.forEach(m => {
      transactionVolumes.Month[m] = {};
      allAmenities.forEach(a => { transactionVolumes.Month[m][a] = 0; });
    });
    projects.forEach(p => {
      const month = p.updatedAt.toLocaleString("default", { month: "short" });
      if (transactionVolumes.Month[month]) {
        (p.amenities || []).forEach(a => {
          if (transactionVolumes.Month[month][a] !== undefined) transactionVolumes.Month[month][a] += 1;
        });
      }
    });

    res.status(200).json({
      success: true,
      trends: {
        roiTrendsByArea,
        rentalYieldByArea, // old format preserved
        transactionVolumes
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
