import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { useState } from 'react';
import { Card, Radio, Space } from 'antd';

const colors = ['#82ca9d', '#ff7f50', '#8884d8', '#ffc658', '#00bcd4', '#a29bfe'];

export default function CustomChart({
  type = 'line',
  data,
  dataKey = 'value',
  labelKey = 'name',
  title = 'Chart',
  compareKeys = [],
}: {
  type?: 'line' | 'bar' | 'pie';
  data: any[];
  dataKey?: string;
  labelKey?: string;
  title?: string;
  compareKeys?: string[]; // for multi-line or multi-bar
}) {
  const [chartType, setChartType] = useState(type);

  return (
    <Card
      title={title}
      extra={
        <Radio.Group value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <Radio.Button value="line">Line</Radio.Button>
          <Radio.Button value="bar">Bar</Radio.Button>
          <Radio.Button value="pie">Pie</Radio.Button>
        </Radio.Group>
      }
      style={{ marginBottom: 24 }}
    >
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={labelKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey={labelKey} stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            {compareKeys.length > 0 ? compareKeys.map((k, i) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                animationDuration={500}
              />
            )) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={colors[0]}
                strokeWidth={2}
                animationDuration={500}
              />
            )}
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey={labelKey} stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            {compareKeys.length > 0 ? compareKeys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                fill={colors[i % colors.length]}
                animationDuration={500}
              />
            )) : (
              <Bar dataKey={dataKey} fill={colors[0]} animationDuration={500} />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
