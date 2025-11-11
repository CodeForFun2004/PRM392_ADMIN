
import { CONFIG } from 'src/config-global';

import { PromotionsView } from 'src/sections/promotion/view/promotions-view';





export default function Page() {
  return (
    <>
      <title>{`Promotion - ${CONFIG.appName}`}</title>

      <PromotionsView  />
    </>
  );
}
