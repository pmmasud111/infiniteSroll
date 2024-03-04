import React, { useEffect, useRef, useState } from "react";
import Product from "./Product";

const productPerPage = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHaseMore] = useState(true);
  const loaderRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const response = await fetch(
          `https://dummyjson.com/products?limit=${productPerPage}&skip=${
            page * productPerPage
          }`
        );
        const data = await response.json();
        if (data.products.length === 0) {
          setHaseMore(false);
        } else {
          setProducts((prevPoducts) => [prevPoducts, ...data.products]);
          setPage((prevPage) => prevPage + 1);
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const onInstraction = (items) => {
      const trackingInfo = items[0];
      if (trackingInfo.isIntersecting) {
        fetchProduct();
      }
    };

    const observer = new IntersectionObserver(onInstraction);
    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (observer) {
        observer.disconnect;
      }
    };
  }, [page]);

  return (
    <div className="w-9/12 mx-auto">
      <h1 className="text-4xl font-bold text-center my-8">Product Lists </h1>
      <li className="grid grid-cols-4 gap-8">
        {products.map((product) => (
          <Product
            key={product?.id}
            title={product?.title}
            price={product?.title}
            thumbnail={product?.thumbnail}
            description={product?.description}
          />
        ))}
      </li>
      {hasMore && (
        <div ref={loaderRef} className="text-center text-xl font-bold">
          Loading..........
        </div>
      )}
    </div>
  );
};

export default Products;
