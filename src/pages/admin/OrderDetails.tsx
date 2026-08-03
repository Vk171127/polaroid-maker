import { useParams } from "react-router";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <>
      <div className="text-3xl font-bold underline">Order Details {id}</div>
    </>
  );
};

export default OrderDetails;
