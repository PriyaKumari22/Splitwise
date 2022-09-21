import { BinaryHeap } from "./heap.js";

onload = function () {
  // create a network

  let currentdt;
  const cont = document.getElementById("mynetwork");
  const c2 = document.getElementById("mynet2");
  const generatenew = document.getElementById("generate-graph");
  const calculate = document.getElementById("calculate");
  const tempt_txt = document.getElementById("tempt_txt");

  // initialise graph options

  const options = {
    edges: {
      arrows: {
        to: true,
      },
      labelHighlightBold: true,
      font: {
        size: 20,
      },
    },
    nodes: {
      font: "12px arial red",
      scaling: {
        label: true,
      },
      shape: "icon",
      icon: {
        face: "FontAwesome",
        code: "\uf183",
        size: 50,
        color: "#991133",
      },
    },
  };

  // initialize your network!

  let network = new vis.Network(cont);
  network.setOptions(options);
  let net2 = new vis.Network(c2);
  net2.setOptions(options);

  function createData() {
    const sz = Math.floor(Math.random() * 8) + 2;

    // Adding people to nodes array

    let nodes = [];
    for (let i = 1; i <= sz; i++) {
      nodes.push({ id: i, label: "Person " + i });
    }
    nodes = new vis.DataSet(nodes);

    // Dynamically creating edges with random amount to be paid from one to another friend

    const edges = [];
    for (let i = 1; i <= sz; i++) {
      for (let j = i + 1; j <= sz; j++) {
        if (Math.random() > 0.5) {
          if (Math.random() > 0.5)
            edges.push({
              from: i,
              to: j,
              label: String(Math.floor(Math.random() * 100) + 1),
            });
          else
            edges.push({
              from: j,
              to: i,
              label: String(Math.floor(Math.random() * 100) + 1),
            });
        }
      }
    }

    const data = {
      nodes: nodes,
      edges: edges,
    };
    return data;
  }

  generatenew.onclick = function () {
    const data = createData();
    currentdt = data;
    network.setData(data);
    tempt_txt.style.display = "inline";
    c2.style.display = "none";
  };

  calculate.onclick = function () {
    tempt_txt.style.display = "none";
    c2.style.display = "inline";
    const calculatedData = calculateData();
    net2.setData(calculatedData);
  };

  function calculateData() {
    let data = currentdt;
    const sz = data["nodes"].length;
    const vals = Array(sz).fill(0);
    // Calculating network balance of each person
    for (let i = 0; i < data["edges"].length; i++) {
      const edge = data["edges"][i];
      vals[edge["to"] - 1] += parseInt(edge["label"]);
      vals[edge["from"] - 1] -= parseInt(edge["label"]);
    }

    const positiveheap = new BinaryHeap();
    const negativeheap = new BinaryHeap();

    for (let i = 0; i < sz; i++) {
      if (vals[i] > 0) {
        positiveheap.insert([vals[i], i]);
      } else {
        negativeheap.insert([-vals[i], i]);
        vals[i] *= -1;
      }
    }

    const edgesnew = [];
    while (!positiveheap.empty() && !negativeheap.empty()) {
      const maxi = positiveheap.extractMax();
      const mini = negativeheap.extractMax();

      const amt = Math.min(maxi[0], mini[0]);
      const to = maxi[1];
      const from = mini[1];

      edgesnew.push({
        from: from + 1,
        to: to + 1,
        label: String(Math.abs(amt)),
      });
      vals[to] -= amt;
      vals[from] -= amt;

      if (maxi[0] > mini[0]) {
        positiveheap.insert([vals[to], to]);
      } else if (maxi[0] < mini[0]) {
        negativeheap.insert([vals[from], from]);
      }
    }

    data = {
      nodes: data["nodes"],
      edges: edgesnew,
    };
    return data;
  }

  generatenew.click();
};
