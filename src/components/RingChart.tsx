import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface DataItem {
  value: number;
  name: string;
}

interface RingChartProps {
  data: DataItem[] | undefined;
}

const RingChart: React.FC<RingChartProps> = ({ data }) => {
  const colors = ['#3C50E0', '#0FADCF'];

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      // top: '4%',
      left: 'center',
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['45%', '75%'],
        avoidLabelOverlap: true,
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#fff',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
        },
        data: data?.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: colors[index % colors.length],
          },
        })),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '250px', width: '100%' }} />;
};

export default RingChart;
