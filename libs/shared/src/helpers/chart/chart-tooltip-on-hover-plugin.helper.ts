import { Chart, ChartEvent, Plugin } from 'chart.js';

export const showTooltipOnHoverPlugin: Plugin = {
  id: 'showTooltipOnHover',
  afterEvent(chart: Chart, args: { event: ChartEvent; replay: boolean; changed?: boolean; cancelable: false; inChartArea: boolean }) {
    const { event } = args;
    if (event.type === 'mousemove' && event.x != null && event.y != null) {
      const activeElements = chart.getElementsAtEventForMode(
        event as unknown as Event,
        'nearest',
        { intersect: true },
        false,
      );
      if (activeElements.length > 0) {
        chart.setActiveElements(activeElements);
        chart.tooltip?.setActiveElements(activeElements, { x: event.x, y: event.y });
      } else {
        chart.setActiveElements([]);
        chart.tooltip?.setActiveElements([], { x: 0, y: 0 });
      }
      chart.update('none');
    }
  },
};
