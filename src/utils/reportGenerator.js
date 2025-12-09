// src/utils/reportGenerator.js
import scoringGuide from '../data/scoringGuide.json';

// parse range strings like "0-33" or keys like "0-25" and return boolean if value fits
const inRange = (rangeKey, value) => {
  // rangeKey might be "0-33" or "67-100" or numeric string "1"
  if (typeof rangeKey === 'string' && rangeKey.includes('-')) {
    const [min, max] = rangeKey.split('-').map(s => Number(s));
    return value >= min && value <= max;
  }
  const n = Number(rangeKey);
  return value === n;
};

export const interpretMetric = (metricName, value) => {
  // metricName e.g. hair_density
  const guide = scoringGuide.scoring_guide.hair_camera_analysis[metricName];
  if (!guide) return { label: 'Unknown', description: '', raw: value };

  const interpretationObj = guide.interpretation || {};
  // find matching interpretation range
  let label = 'Unknown';
  for (const key of Object.keys(interpretationObj)) {
    if (inRange(key, value)) {
      label = interpretationObj[key];
      break;
    }
  }

  return {
    raw: value,
    label,
    description: guide.description || '',
    note: guide.note || ''
  };
};

// Generate nutrition tags (example: classify by hair_type and recommend tags)
export const buildNutritionProfile = (analysis) => {
  // naive rules — replace with a call to AI/ML if desired
  const tags = new Set();

  // dietary tags from scoring guide
  const possibleDiet = scoringGuide.scoring_guide.dietary_tags || [];
  // If user provided any dietary info in answers, use them (answers may contain e.g. dietary preference)
  if (analysis.answers?.dietary) {
    // assume answers.dietary holds keys that match scoring guide
    const d = analysis.answers.dietary;
    if (possibleDiet.includes(d)) tags.add(d);
  }

  // infer from damage/hair density/thickness
  const hd = analysis.hair_density ?? analysis.answers?.hair_density;
  const dt = analysis.hair_thickness ?? analysis.answers?.hair_thickness;
  const damage = analysis.damage_level ?? analysis.answers?.damage_level;

  if (hd !== undefined && hd < 40) tags.add('low-density');
  if (dt !== undefined && dt < 40) tags.add('thin-hair');
  if (damage !== undefined && damage > 60) tags.add('high-damage');

  return Array.from(tags);
};

export const recommendedBloodTests = (analysis) => {
  // evidence-based baseline set for hair loss/nutrition
  const tests = [
    'Complete Blood Count (CBC)',
    'Serum Ferritin (Iron stores)',
    'Serum Iron & TIBC',
    'Thyroid Stimulating Hormone (TSH)',
    'Free T4 / Free T3',
    'Vitamin B12',
    'Vitamin D (25-OH)',
    'Zinc',
    'Liver function (ALT/AST)',
    'Sex Hormone profile (if clinically indicated: testosterone, DHEA, SHBG)'
  ];

  // customize based on symptoms / answers
  const out = new Set(tests);
  if (analysis.answers?.gastric && analysis.answers.gastric !== 'No') {
    out.add('Celiac serology (if malabsorption suspected)');
    out.add('Folate');
  }
  if (analysis.answers?.medication && analysis.answers.medication !== 'No') {
    out.add('Medication review with prescriber');
  }
  return Array.from(out);
};

export const generateReport = (record) => {
  // Accept either record.report already present or values from record
  // We'll read numeric metrics from record.report if present, otherwise from record.answers or record (response)
  const source = record.report ?? record; // allow both shapes
  // assume the camera analysis metrics are either top-level or in record.answers
  const hairDensity = source.hair_density ?? record.answers?.hair_density ?? 0;
  const hairThickness = source.hair_thickness ?? record.answers?.hair_thickness ?? 0;
  const damageLevel = source.damage_level ?? record.answers?.damage_level ?? 0;
  const scalpCondition = source.scalp_condition ?? record.answers?.scalp_condition ?? 0;
  const hairType = source.hair_type ?? record.answers?.hair_type ?? 1;

  const densityInterpret = interpretMetric('hair_density', hairDensity);
  const thicknessInterpret = interpretMetric('hair_thickness', hairThickness);
  const damageInterpret = interpretMetric('damage_level', damageLevel);
  const scalpInterpret = interpretMetric('scalp_condition', scalpCondition);
  const hairTypeInterpret = scoringGuide.scoring_guide.hair_camera_analysis.hair_type.interpretation[String(hairType)] || 'Unknown';

  // Build "hair loss" score: combine density and damage (low density + high damage => higher loss severity)
  // We'll compute a "hair_loss_risk" 0..100 where higher means more hair-loss concern
  const lossRisk = Math.round((100 - hairDensity) * 0.6 + damageLevel * 0.4);

  // nutrition profile
  const nutritionTags = buildNutritionProfile({ ...source, answers: record.answers });

  // likely causes from simple heuristics
  const causes = [];
  if (lossRisk > 60) causes.push('Androgenic/Patterned hair loss likely');
  if (damageLevel > 70) causes.push('Mechanical/chemical damage likely');
  if (scalpCondition < 40) causes.push('Scalp dermatological condition possible (dandruff/seborrhea)');
  if (record.answers?.familyHistory && record.answers.familyHistory !== 'No') causes.push('Family history suggests genetic contribution');
  if ((record.answers?.stress ?? 0) >= 8) causes.push('High stress may contribute');

  const recommendations = new Set(record.recommendations || []);
  // Add general recs
  if (damageLevel > 60) recommendations.add('Reduce chemical/heat styling; use protein repairing treatments');
  if (hairDensity < 50) recommendations.add('Consider topical minoxidil or specialist referral');
  if (scalpCondition < 50) recommendations.add('Treat scalp condition with medicated shampoo (ketoconazole) or dermatologist review');

  // blood tests
  const bloodTests = recommendedBloodTests(record);

  // Return a structured report
  return {
    metrics: {
      hair_density: { value: hairDensity, interpretation: densityInterpret },
      hair_thickness: { value: hairThickness, interpretation: thicknessInterpret },
      damage_level: { value: damageLevel, interpretation: damageInterpret },
      scalp_condition: { value: scalpCondition, interpretation: scalpInterpret },
      hair_type: { value: hairType, interpretation: hairTypeInterpret }
    },
    hair_loss: {
      lossRisk,
      causes,
      symptoms: record.answers || {}
    },
    nutrition: {
      tags: nutritionTags,
      aiNarrative: `Nutrition analysis based on symptoms & answers — ${nutritionTags.join(', ') || 'No specific tags'}.` // placeholder for AI
    },
    recommendations: Array.from(recommendations),
    bloodTests,
    generatedAt: new Date().toISOString(),
    generatedBy: 'rule-and-heuristic-engine-v1'
  };
};
