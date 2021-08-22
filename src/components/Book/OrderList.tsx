type Order = {
  price: number;
  size: number;
};

interface Props {
  hideHeader?: boolean;
  orders: Order[];
}

export const OrderList = ({ hideHeader = false, orders = [] }: Props) => {
  return (
    <div>
      {!hideHeader && (
        <div>
          <div>TOTAL</div>
          <div>SIZE</div>
          <div>PRICE</div>
        </div>
      )}
      <div>
        {orders.map((order) => (
          <div>
            <div>{order.price}</div>
            <div>{order.size}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
