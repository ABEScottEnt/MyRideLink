export const testTransitData = [
  {
    id: 1,
    name: "Route 1",
    time: "35 min",
    type: "fastest",
    amount: "$3.25",
    steps: [
      {
        type: "bus",
        Lane: "Bus 42",
        Start: "Main St",
        Stop: "Metro Center",
        Duration: "15 min",
      },
      {
        type: "Metro",
        Lane: "Metro Red Line",
        Start: "Metro Center",
        Stop: "Downtown",
        Duration: "20 min",
      },
    ],
    NextDeparture: "8 min",
  },
  {
    id: 2,
    name: "Route 2",
    time: "48 min",
    type: "cheapest",
    amount: "$2.50",
    steps: [
      {
        type: "bus",
        Lane: "Bus 15",
        Start: "Main St",
        Stop: "Union Station",
        Duration: "28 min",
      },
      {
        type: "bus",
        Lane: "Bus 8",
        Start: "Union Station",
        Stop: "Downtown",
        Duration: "20 min",
      },
    ],
    NextDeparture: "12 min",
  },
  {
    id: 3,
    name: "Route 3",
    time: "42 min",
    type: "Least walking",
    amount: "$3.00",
    steps: [
      {
        type: "Metro",
        Lane: "Metro Blue Line",
        Start: "Direct Route",
        Duration: "42 min",
      },
    ],
    NextDeparture: "5 min",
  },
];