'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTranslations } from 'next-intl';

type Criteria = {
  applicationTime?: number;
  waterMerge?: number;
  postWashFeel?: number;
  fluidity?: number;
  spreadability?: number;
  transparency?: number;
};

type Props = {
  criteria: Criteria;
};

const ProductCriteriaRadar = ({ criteria }: Props) => {
  const t = useTranslations('ProductCriteria');

  const data = [
    {
      criterion: t('applicationTime'),
      score: criteria.applicationTime ?? 0,
    },
    {
      criterion: t('waterMerge'),
      score: criteria.waterMerge ?? 0,
    },
    {
      criterion: t('postWashFeel'),
      score: criteria.postWashFeel ?? 0,
    },
    {
      criterion: t('fluidity'),
      score: criteria.fluidity ?? 0,
    },
    {
      criterion: t('spreadability'),
      score: criteria.spreadability ?? 0,
    },
    {
      criterion: t('transparency'),
      score: criteria.transparency ?? 0,
    },
  ];

  return (
    <div className="w-full h-[300px] md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="criterion"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Radar
            name={t('evaluation')}
            dataKey="score"
            stroke="#7F434E"
            fill="#7F434E"
            fillOpacity={0.8}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductCriteriaRadar;
