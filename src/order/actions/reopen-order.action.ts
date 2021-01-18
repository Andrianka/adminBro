import { Order } from '../order.entity';

export const reopenOrder = async (response, request, context) => {
  const { record } = context;
  let status;
  try {
    const order = await Order.findOne(record.params.id);

    const updatedOrder = await order.reopenOrder();
    status = updatedOrder.status;
  } catch (error) {
    const errorMessage = 'Something went wrong: ' + error.message;
    return {
      notice: {
        type: 'error',
        message: errorMessage,
      },
      record: {
        ...context.record.toJSON(),
      },
    };
  }
  return {
    notice: {
      type: 'success',
      message: 'Status was changed.',
    },
    record: {
      ...context.record.toJSON(),
      params: {
        ...context.record.toJSON().params,
        status: status,
      },
    },
  };
};
