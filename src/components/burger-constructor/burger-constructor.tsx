import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { isAuthenticated } from '../../services/slices/userSlice/userSlice';
import {
  orderRequest as selectOrderRequest,
  currentOrder
} from '../../services/slices/orderSlice';
import {
  TIngredientWithId,
  clearConstructor
} from '../../services/slices/burgerConstructorSlice';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(currentOrder);
  const isAuth = useSelector(isAuthenticated);

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  useEffect(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredientWithId) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
