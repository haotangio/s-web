import { validatorFactory } from '../../../utils/reduxForm';

const schema = {
  firstName: { presence: true },
  lastName: { presence: true },
  email: { presence: true, email: true, emailDomain: true },
  sponsor: { presence: true },
};

export default validatorFactory(schema);
