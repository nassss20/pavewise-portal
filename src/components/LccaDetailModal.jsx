import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AiLifespanPredictor from './AiLifespanPredictor';

const LCCA_SCHEDULE_DATA = {
  CRMA: {
    title: "CRMA - Crumb Rubber Modified Asphalt",
    avgInitialCost: 933329.19,
    avgMaintenanceCost: 167999.00,
    avgNpv: 1035452.95,
    costRatio: 0.18,
    distressLevel: "No damage",
    ranking: 1,
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    assets: [
      {
        name: "Yong-Peng, FT0024 (58-59)",
        initialCost: 999987.58,
        maintCost: 179997.76,
        npv: 1094297.55,
        schedule: [
          { year: "2021", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 999987.58, rate: "4%", n: "0", pf: 1.0000, npv: 999987.58 },
          { year: "2022 - 2028", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "3-9", pf: 0.0000, npv: 0.00 },
          { year: "2029", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 29999.63, rate: "4%", n: "10", pf: 0.6756, npv: 20266.67 },
          { year: "2030 - 2036", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "11-17", pf: 0.0000, npv: 0.00 },
          { year: "2037", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 149998.14, rate: "4%", n: "18", pf: 0.4936, npv: 74043.30 },
          { year: "2038 - 2041", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "19-22", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Muar By Pass, FT0224 (1-2)",
        initialCost: 1000000.00,
        maintCost: 180000.00,
        npv: 1098083.59,
        schedule: [
          { year: "2020", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1000000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1000000.00 },
          { year: "2021 - 2027", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "2-8", pf: 0.0000, npv: 0.00 },
          { year: "2028", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "9", pf: 0.7026, npv: 21077.60 },
          { year: "2029 - 2035", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "10-16", pf: 0.0000, npv: 0.00 },
          { year: "2036", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 150000.00, rate: "4%", n: "17", pf: 0.5134, npv: 77005.99 },
          { year: "2037 - 2040", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "18-21", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Muar By Pass, FT0224 (4-5)",
        initialCost: 800000.00,
        maintCost: 144000.00,
        npv: 878466.87,
        schedule: [
          { year: "2020", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 800000.00, rate: "4%", n: "0", pf: 1.0000, npv: 800000.00 },
          { year: "2021 - 2027", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "2-8", pf: 0.0000, npv: 0.00 },
          { year: "2028", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 24000.00, rate: "4%", n: "9", pf: 0.7026, npv: 16862.08 },
          { year: "2029 - 2035", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "10-16", pf: 0.0000, npv: 0.00 },
          { year: "2036", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 120000.00, rate: "4%", n: "17", pf: 0.5134, npv: 61604.79 },
          { year: "2037 - 2040", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "18-21", pf: 0.0000, npv: 0.00 },
        ]
      }
    ]
  },
  SFM: {
    title: "SFM - Stone Fiber Modified Asphalt",
    avgInitialCost: 976666.67,
    avgMaintenanceCost: 175800.00,
    avgNpv: 1070914.94,
    costRatio: 0.18,
    distressLevel: "No damage",
    ranking: 2,
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    assets: [
      {
        name: "Yong-Peng, FT0024 (62-63)",
        initialCost: 1230000.00,
        maintCost: 221400.00,
        npv: 1346002.71,
        schedule: [
          { year: "2021", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1230000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1230000.00 },
          { year: "2021 - 2027", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "3-9", pf: 0.0000, npv: 0.00 },
          { year: "2028", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 36900.00, rate: "4%", n: "10", pf: 0.6756, npv: 24928.32 },
          { year: "2029 - 2036", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "11-17", pf: 0.0000, npv: 0.00 },
          { year: "2037", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 184500.00, rate: "4%", n: "18", pf: 0.4936, npv: 91074.39 },
          { year: "2038 - 2041", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "19-22", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Muar By Pass, FT0224 - (3-4)",
        initialCost: 1000000.00,
        maintCost: 180000.00,
        npv: 1098083.59,
        schedule: [
          { year: "2020", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1000000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1000000.00 },
          { year: "2020 - 2027", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "2-8", pf: 0.0000, npv: 0.00 },
          { year: "2028", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "9", pf: 0.7026, npv: 21077.60 },
          { year: "2029 - 2036", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "10-16", pf: 0.0000, npv: 0.00 },
          { year: "2037", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 150000.00, rate: "4%", n: "17", pf: 0.5134, npv: 77005.99 },
          { year: "2038 - 2040", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "18-21", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Muar By Pass, FT0224 - (5-6)",
        initialCost: 700000.00,
        maintCost: 126000.00,
        npv: 768658.51,
        schedule: [
          { year: "2020", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 700000.00, rate: "4%", n: "0", pf: 1.0000, npv: 700000.00 },
          { year: "2020 - 2027", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "2-8", pf: 0.0000, npv: 0.00 },
          { year: "2028", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 21000.00, rate: "4%", n: "9", pf: 0.7026, npv: 14754.32 },
          { year: "2029 - 2036", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "10-16", pf: 0.0000, npv: 0.00 },
          { year: "2037", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 105000.00, rate: "4%", n: "17", pf: 0.5134, npv: 53904.19 },
          { year: "2038 - 2040", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "18-21", pf: 0.0000, npv: 0.00 },
        ]
      }
    ]
  },
  CMA: {
    title: "CMA - Crumb Modified Asphalt",
    avgInitialCost: 900000.00,
    avgMaintenanceCost: 287333.33,
    avgNpv: 1081995.58,
    costRatio: 0.32,
    distressLevel: "Recurring pothole & crack",
    ranking: 3,
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    assets: [
      {
        name: "Yong-Peng, FT0024 Muar (33-34)",
        initialCost: 1000000.00,
        maintCost: 210000.00,
        npv: 1135955.42,
        schedule: [
          { year: "2019", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1000000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1000000.00 },
          { year: "2020 - 2024", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "1-5", pf: 0.0000, npv: 0.00 },
          { year: "2025", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "6", pf: 0.7903, npv: 23709.44 },
          { year: "2026 - 2029", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "7-10", pf: 0.0000, npv: 0.00 },
          { year: "2030", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 150000.00, rate: "4%", n: "11", pf: 0.6496, npv: 97437.14 },
          { year: "2031 - 2036", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "12-17", pf: 0.0000, npv: 0.00 },
          { year: "2037", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "18", pf: 0.4936, npv: 14808.84 },
          { year: "2038 - 2039", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "19-20", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Johor Bahru - Melaka, FT0005 (159-160)",
        initialCost: 850000.00,
        maintCost: 178500.00,
        npv: 965562.16,
        schedule: [
          { year: "2019", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 850000.00, rate: "4%", n: "0", pf: 1.0000, npv: 850000.00 },
          { year: "2020 - 2024", activity: "No Maintenance required", assumed: "-", cost: 0.00, rate: "4%", n: "1-5", pf: 0.0000, npv: 0.00 },
          { year: "2025", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 25500.00, rate: "4%", n: "6", pf: 0.7903, npv: 20153.02 },
          { year: "2026 - 2029", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "7-10", pf: 0.0000, npv: 0.00 },
          { year: "2030", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 127500.00, rate: "4%", n: "11", pf: 0.6496, npv: 82821.57 },
          { year: "2031 - 2036", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "12-17", pf: 0.0000, npv: 0.00 },
          { year: "2037", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 25500.00, rate: "4%", n: "18", pf: 0.4936, npv: 12587.52 },
          { year: "2038 - 2039", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "19-20", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Johor Bahru - Melaka, FT0005 (172-173)",
        initialCost: 850000.00,
        maintCost: 473500.00,
        npv: 1144469.17,
        schedule: [
          { year: "2019", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 850000.00, rate: "4%", n: "0", pf: 1.0000, npv: 850000.00 },
          { year: "2020", activity: "Patching", assumed: "Actual Maintenance Cost (4 month)", cost: 2000.00, rate: "4%", n: "2", pf: 0.9246, npv: 1849.11 },
          { year: "2021", activity: "Patching", assumed: "Actual Maintenance Cost (4 month)", cost: 2000.00, rate: "4%", n: "3", pf: 0.8890, npv: 1777.99 },
          { year: "2022", activity: "Patching", assumed: "Actual Maintenance Cost (4 month)", cost: 2000.00, rate: "4%", n: "4", pf: 0.8548, npv: 1709.61 },
          { year: "2023", activity: "Corrective Maintenance", assumed: "10% of initial cost", cost: 85000.00, rate: "4%", n: "5", pf: 0.8219, npv: 69863.80 },
          { year: "2023 - 2026", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "6-7", pf: 0.0000, npv: 0.00 },
          { year: "2027", activity: "Periodic Maintenance", assumed: "25% of initial cost", cost: 212500.00, rate: "4%", n: "8", pf: 0.7307, npv: 155271.67 },
          { year: "2028 - 2031", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "8-12", pf: 0.0000, npv: 0.00 },
          { year: "2032", activity: "Corrective Maintenance", assumed: "10% of initial cost", cost: 85000.00, rate: "4%", n: "13", pf: 0.6006, npv: 51048.80 },
          { year: "2033 - 2037", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "14-18", pf: 0.0000, npv: 0.00 },
          { year: "2038", activity: "Periodic Maintenance", assumed: "10% of initial cost", cost: 85000.00, rate: "4%", n: "19", pf: 0.4746, npv: 40344.61 },
          { year: "2039", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "20", pf: 0.0000, npv: 0.00 },
        ]
      }
    ]
  },
  LATEX: {
    title: "LATEX - Polymer Latex Modified Asphalt",
    avgInitialCost: 879992.39,
    avgMaintenanceCost: 433528.54,
    avgNpv: 1136719.39,
    costRatio: 0.49,
    distressLevel: "Recurring shoving + monthly patch",
    ranking: 4,
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    assets: [
      {
        name: "Muar By Pass, FT0224 (12-13)",
        initialCost: 899977.18,
        maintCost: 571985.62,
        npv: 1305297.97,
        schedule: [
          { year: "2022", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 899977.18, rate: "4%", n: "0", pf: 1.0000, npv: 899977.18 },
          { year: "2022", activity: "Patching", assumed: "Actual Maintenance Cost (10 month)", cost: 5000.00, rate: "4%", n: "4", pf: 0.8548, npv: 4274.02 },
          { year: "2022 - 2023", activity: "Shoving appeared", assumed: "-", cost: 0.00, rate: "4%", n: "4-5", pf: 0.0000, npv: 0.00 },
          { year: "2024", activity: "Major Rehabilitation", assumed: "35% Initial Cost", cost: 314992.01, rate: "4%", n: "6", pf: 0.7903, npv: 248942.76 },
          { year: "2025 - 2027", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "7-9", pf: 0.0000, npv: 0.00 },
          { year: "2028", activity: "Corrective Maintenance", assumed: "10% Initial Cost", cost: 89997.72, rate: "4%", n: "10", pf: 0.6756, npv: 60799.23 },
          { year: "2029 - 2032", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "11-13", pf: 0.0000, npv: 0.00 },
          { year: "2033", activity: "Periodic Maintenance", assumed: "15% of initial cost", cost: 134996.58, rate: "4%", n: "14", pf: 0.5775, npv: 77957.16 },
          { year: "2034 - 2037", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "15-17", pf: 0.0000, npv: 0.00 },
          { year: "2038", activity: "Preventive Maintenance", assumed: "3% Initial Cost", cost: 26999.32, rate: "4%", n: "18", pf: 0.4936, npv: 13327.62 },
          { year: "2039 - 2042", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "19-23", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Yong-Peng, FT0024 Muar (44-45)",
        initialCost: 870000.00,
        maintCost: 374100.00,
        npv: 1117011.93,
        schedule: [
          { year: "2021", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 870000.00, rate: "4%", n: "0", pf: 1.0000, npv: 870000.00 },
          { year: "2021 - 2022", activity: "Minor Distressed Observed", assumed: "-", cost: 0.00, rate: "4%", n: "3-4", pf: 0.0000, npv: 0.00 },
          { year: "2023", activity: "Corrective Maintenance", assumed: "10% of initial cost", cost: 87000.00, rate: "4%", n: "5", pf: 0.8219, npv: 71507.66 },
          { year: "2024 - 2025", activity: "Minor Distressed Observed", assumed: "-", cost: 0.00, rate: "4%", n: "6-7", pf: 0.0000, npv: 0.00 },
          { year: "2026", activity: "Corrective Maintenance", assumed: "10% of initial cost", cost: 87000.00, rate: "4%", n: "8", pf: 0.7307, npv: 63570.05 },
          { year: "2028 - 2032", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "9-13", pf: 0.0000, npv: 0.00 },
          { year: "2033", activity: "Periodic Maintenance", assumed: "20% of initial cost", cost: 174000.00, rate: "4%", n: "14", pf: 0.5775, npv: 100480.66 },
          { year: "2034 - 2039", activity: "No Major Intervention", assumed: "-", cost: 0.00, rate: "4%", n: "15-20", pf: 0.0000, npv: 0.00 },
          { year: "2040", activity: "Preventive Maintenance", assumed: "3% of initial cost", cost: 26100.00, rate: "4%", n: "21", pf: 0.4388, npv: 11453.56 },
          { year: "2041", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "22", pf: 0.4220, npv: 0.00 },
        ]
      },
      {
        name: "Yong-Peng, FT0024 Muar (53-54)",
        initialCost: 870000.00,
        maintCost: 354500.00,
        npv: 988448.26,
        schedule: [
          { year: "2021", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 870000.00, rate: "4%", n: "0", pf: 1.0000, npv: 870000.00 },
          { year: "2023", activity: "Patching", assumed: "Actual Maintenance Cost (3 month)", cost: 1500.00, rate: "4%", n: "5", pf: 0.8219, npv: 1232.89 },
          { year: "2024", activity: "Patching", assumed: "Actual Maintenance Cost (4 month)", cost: 2000.00, rate: "4%", n: "6", pf: 0.7903, npv: 1580.63 },
          { year: "2025", activity: "Patching", assumed: "Actual Maintenance Cost (6 month)", cost: 3000.00, rate: "4%", n: "7", pf: 0.7599, npv: 2279.75 },
          { year: "2027", activity: "Corrective Maintenance", assumed: "10% of initial cost", cost: 87000.00, rate: "4%", n: "9", pf: 0.7026, npv: 61125.05 },
          { year: "2028 - 2030", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "10-12", pf: 0.0000, npv: 0.00 },
          { year: "2030", activity: "Corrective Maintenance", assumed: "10% of initial cost", cost: 87000.00, rate: "4%", n: "13", pf: 0.6006, npv: 52249.95 },
          { year: "2031 - 2035", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "14-17", pf: 0.0000, npv: 0.00 },
          { year: "2036", activity: "Periodic Maintenance", assumed: "20% of initial cost", cost: 174000.00, rate: "4%", n: "18", pf: 0.4936, npv: 85891.29 },
          { year: "2037 - 2041", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "19-22", pf: 0.0000, npv: 0.00 },
        ]
      }
    ]
  },
  AC: {
    title: "AC",
    avgInitialCost: 1066666.67,
    avgMaintenanceCost: 320000.00,
    avgNpv: 1263978.72,
    costRatio: 0.30,
    distressLevel: "Recurring pothole & crack",
    ranking: 5,
    badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
    assets: [
      {
        name: "Yong-Peng, FT0024 Muar (45-46)",
        initialCost: 1000000.00,
        maintCost: 270000.00,
        npv: 1198425.49,
        schedule: [
          { year: "2018", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1000000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1000000.00 },
          { year: "2019 - 2020", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "1-3", pf: 0.0000, npv: 0.00 },
          { year: "2021", activity: "Corrective Patching for Localized Potholes", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "4", pf: 0.8548, npv: 25644.13 },
          { year: "2022 - 2023", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "5-6", pf: 0.0000, npv: 0.00 },
          { year: "2024", activity: "Corrective Patching for Recurring Localized Defects", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "7", pf: 0.7599, npv: 22797.53 },
          { year: "2025", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "8", pf: 0.0000, npv: 0.00 },
          { year: "2026", activity: "Corrective Patching", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "9", pf: 0.7026, npv: 21077.60 },
          { year: "2027 - 2029", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "10-12", pf: 0.0000, npv: 0.00 },
          { year: "2030", activity: "Preventive Maintenance / Crack Treatment", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "13", pf: 0.6006, npv: 18017.22 },
          { year: "2031 - 2032", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "14-15", pf: 0.0000, npv: 0.00 },
          { year: "2033", activity: "Periodic Maintenance - Milling & Overlay", assumed: "15% of initial cost", cost: 150000.00, rate: "4%", n: "16", pf: 0.5339, npv: 80086.23 },
          { year: "2034 - 2037", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "17-20", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Yong-Peng, FT0024 Muar (46-47)",
        initialCost: 1000000.00,
        maintCost: 300000.00,
        npv: 1224278.41,
        schedule: [
          { year: "2018", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1000000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1000000.00 },
          { year: "2019", activity: "No Major Maintenance", assumed: "-", cost: 0.00, rate: "4%", n: "1-2", pf: 0.0000, npv: 0.00 },
          { year: "2020", activity: "Corrective Patching for Localized Potholes", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "3", pf: 0.8890, npv: 26669.89 },
          { year: "2021 - 2022", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "4-5", pf: 0.0000, npv: 0.00 },
          { year: "2023", activity: "Corrective Patching for Recurring Localized Defects", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "6", pf: 0.7903, npv: 23709.44 },
          { year: "2024", activity: "Corrective Patching - Localized Pavement Defects", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "7", pf: 0.7599, npv: 22797.53 },
          { year: "2025", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "8", pf: 0.0000, npv: 0.00 },
          { year: "2026", activity: "Corrective Patching - Recurring Defects", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "9", pf: 0.7026, npv: 21077.60 },
          { year: "2027 - 2029", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "10-12", pf: 0.0000, npv: 0.00 },
          { year: "2030", activity: "Preventive Maintenance - Crack/Surface Treatment", assumed: "3% of initial cost", cost: 30000.00, rate: "4%", n: "13", pf: 0.6006, npv: 18017.22 },
          { year: "2031 - 2032", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "14-15", pf: 0.0000, npv: 0.00 },
          { year: "2033", activity: "Periodic Maintenance - Milling & Overlay", assumed: "15% of initial cost", cost: 150000.00, rate: "4%", n: "16", pf: 0.5339, npv: 80086.23 },
          { year: "2034 - 2037", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "17-20", pf: 0.0000, npv: 0.00 },
        ]
      },
      {
        name: "Muar By Pass, FT0224 (2-3)",
        initialCost: 1200000.00,
        maintCost: 396000.00,
        npv: 1396232.26,
        schedule: [
          { year: "2018", activity: "Initial Construction", assumed: "Actual Construction Cost", cost: 1200000.00, rate: "4%", n: "0", pf: 1.0000, npv: 1200000.00 },
          { year: "2019", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "2", pf: 0.9246, npv: 0.00 },
          { year: "2020", activity: "Corrective Patching - Localized Potholes/Surface D", assumed: "3% of initial cost", cost: 36000.00, rate: "4%", n: "3", pf: 0.8890, npv: 32003.87 },
          { year: "2021", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "4", pf: 0.8548, npv: 0.00 },
          { year: "2022", activity: "Corrective Patching - Recurring Localized Defects", assumed: "3% of initial cost", cost: 36000.00, rate: "4%", n: "5", pf: 0.8219, npv: 29589.38 },
          { year: "2023", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "6", pf: 0.0000, npv: 0.00 },
          { year: "2024", activity: "Corrective Patching - Localized Pavement Defects", assumed: "3% of initial cost", cost: 36000.00, rate: "4%", n: "7", pf: 0.7599, npv: 27357.04 },
          { year: "2025", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "8", pf: 0.0000, npv: 0.00 },
          { year: "2026", activity: "Corrective Patching - Recurring Pothole/Patched A", assumed: "3% of initial cost", cost: 36000.00, rate: "4%", n: "9", pf: 0.7026, npv: 25293.12 },
          { year: "2027 - 2028", activity: "Routine Monitoring Only", assumed: "-", cost: 0.00, rate: "4%", n: "10-11", pf: 0.0000, npv: 0.00 },
          { year: "2029", activity: "Preventive Maintenance - Crack/SURFACE Treatm", assumed: "3% of initial cost", cost: 36000.00, rate: "4%", n: "12", pf: 0.6246, npv: 22485.49 },
          { year: "2030 - 2032", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "13-15", pf: 0.0000, npv: 0.00 },
          { year: "2033", activity: "Periodic Maintenance - Milling & Overlay", assumed: "15% of initial cost", cost: 180000.00, rate: "4%", n: "16", pf: 0.5339, npv: 96103.47 },
          { year: "2034 - 2037", activity: "Routine Monitoring", assumed: "-", cost: 0.00, rate: "4%", n: "17-20", pf: 0.0000, npv: 0.00 },
        ]
      }
    ]
  }
};

export default function LccaDetailModal({ isOpen, onClose, alternativeKey }) {
  const [selectedAssetIdx, setSelectedAssetIdx] = useState(0);

  useEffect(() => {
    setSelectedAssetIdx(0);
  }, [alternativeKey]);

  const data = LCCA_SCHEDULE_DATA[alternativeKey] || LCCA_SCHEDULE_DATA.SFM;
  const currentAsset = data.assets[selectedAssetIdx] || data.assets[0];

  if (!isOpen || !alternativeKey) return null;

  const formatCurrency = (val) => {
    return `RM ${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="glass-panel w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${data.badgeColor}`}>
              Rank #{data.ranking}
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {data.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* Key Metrics Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block mb-1">
                Average Initial Cost
              </span>
              <p className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {formatCurrency(data.avgInitialCost)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                Total Maintenance Cost
              </span>
              <p className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {formatCurrency(data.avgMaintenanceCost)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Average Net Present Value (NPV)
              </span>
              <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(data.avgNpv)}
              </p>
            </div>
          </div>

          <AiLifespanPredictor materialName={data.title} scheduleData={currentAsset.schedule} />

          {/* Asset Selector Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Representative Road Section:
            </label>
            <div className="flex flex-wrap gap-2">
              {data.assets.map((ast, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAssetIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    selectedAssetIdx === idx
                      ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-cyan-500/50'
                  }`}
                >
                  📍 {ast.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Schedule Header */}
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Road Section: {currentAsset.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Initial: <span className="font-mono font-semibold">{formatCurrency(currentAsset.initialCost)}</span> | Maintenance: <span className="font-mono font-semibold">{formatCurrency(currentAsset.maintCost)}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-medium">Computed Section NPV</span>
              <p className="text-base font-black font-mono text-cyan-600 dark:text-cyan-400">
                {formatCurrency(currentAsset.npv)}
              </p>
            </div>
          </div>

          {/* 20-Year Maintenance Schedule Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold tracking-wider border-b border-slate-200/80 dark:border-slate-800/80">
                  <th className="px-4 py-3">Calendar Year</th>
                  <th className="px-4 py-3">Cost Component Activity</th>
                  <th className="px-4 py-3">Assumed Cost Basis</th>
                  <th className="px-4 py-3 text-right">Cost (RM)</th>
                  <th className="px-4 py-3 text-center">Discount (i)</th>
                  <th className="px-4 py-3 text-center">Year (n)</th>
                  <th className="px-4 py-3 text-center">P/F Factor</th>
                  <th className="px-4 py-3 text-right">Present Value NPV (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-xs">
                {currentAsset.schedule.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap font-mono">
                      {item.year}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 min-w-[180px]">
                      {item.activity}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-[11px]">
                      {item.assumed}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500">{item.rate}</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500">{item.n}</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500">{item.pf.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                      {formatCurrency(item.npv)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex justify-end items-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white text-xs font-bold rounded-xl transition-all shadow-md"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
