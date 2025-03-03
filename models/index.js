import Student from './Student.js';
import Course from './Course.js';
import Cart from './Cart.js';
import { associateStudent } from './Student.js';
import { associateCourse } from './Course.js';
import { associateCart } from './Cart.js';

const models = {
    Student,
    Course,
    Cart
};

// Set up associations
associateStudent(models);
associateCourse(models);
associateCart(models);

export default models; 