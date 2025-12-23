import Card from "./components/Card";
import ProductCard from './components/productCard'

function App() {

  const user = [
    {
      "username": "Pranav",
      "age": 20,
      "phone": "980001",
      "dp": "https://randomuser.me/api/portraits/men/10.jpg"
    },
    {
      "username": "Aisha",
      "age": 25,
      "phone": "980002",
      "dp": "https://randomuser.me/api/portraits/women/21.jpg"
    },
    {
      "username": "Diego",
      "age": 32,
      "phone": "980003",
      "dp": "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      "username": "Maya",
      "age": 28,
      "phone": "980004",
      "dp": "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      "username": "Liam",
      "age": 22,
      "phone": "980005",
      "dp": "https://randomuser.me/api/portraits/men/68.jpg"
    }
  ];

  return (
    <>
      <h1>PinstaGram</h1>

      {/* <div>
        {user.map((elem, idx) => (
          <Card key={idx} {...elem} />
        ))}
      </div> */}

      <ProductCard/>
    </>
  );
}

export default App;
