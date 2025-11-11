
import { CONFIG } from 'src/config-global';

import { OrdersView } from 'src/sections/order/view/orders-view';





export default function Page() {
  return (
    <>
      <title>{`Order - ${CONFIG.appName}`}</title>

      <OrdersView  />
    </>
  );
}
