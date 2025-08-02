import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { userOrders } from '../../services/slices/orderSlice/orderSlice';
import { useEffect } from 'react';
import { fetchUserOrders } from '../../services/slices/orderSlice/orderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(userOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
