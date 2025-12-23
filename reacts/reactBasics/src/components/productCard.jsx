import axios from 'axios';
import { useEffect, useState } from 'react';

function ProductCard() {
  const [data, setData] = useState([]);

  async function getItem() {
    const resp = await axios.get('https://fakestoreapi.com/products');
    setData(resp.data);
    console.log("Response data:", resp.data);
  }

//   useEffect(() => {
//     console.log("Updated React state:", data);
//   }, [data]); 

  return (
    <>
      <button onClick={getItem}>Get Items</button>
      {data.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </>
  );
}

export default ProductCard;
