import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import medicinesReducer from './slices/medicine';
import doctorDetailReducer from './slices/DoctorDetail';
import doctorReducer from './slices/doctor';
import userReducer from './slices/user';
import departmentReducer from './slices/department';
import articleReducer from './slices/article';
import articlecateReducer from './slices/articlecate';
import supplierReducer from './slices/supplier';
import productcateReducer from './slices/productcate';
import userDetailReducer from './slices/UserDetail';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  medicine: medicinesReducer,
  product: persistReducer(productPersistConfig, productReducer),
  doctordetail: doctorDetailReducer,
  doctor: doctorReducer,
  user: userReducer,
  department: departmentReducer,
  article: articleReducer,
  articlecate: articlecateReducer,
  supplier: supplierReducer,
  productcate: productcateReducer,
  userdetail: userDetailReducer,
});

export { rootPersistConfig, rootReducer };
