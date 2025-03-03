import Course from '../models/Course.js';

const sampleCourses = [
    {
        course_name: 'Introduction to Computer Science',
        schedule: 'Monday/Wednesday 9:00 AM - 10:30 AM'
    },
    {
        course_name: 'Advanced Mathematics',
        schedule: 'Tuesday/Thursday 2:00 PM - 3:30 PM'
    },
    {
        course_name: 'English Literature',
        schedule: 'Monday/Wednesday 1:00 PM - 2:30 PM'
    },
    {
        course_name: 'Physics 101',
        schedule: 'Tuesday/Thursday 10:00 AM - 11:30 AM'
    },
    {
        course_name: 'World History',
        schedule: 'Friday 9:00 AM - 12:00 PM'
    },
    {
        course_name: 'Introduction to Psychology',
        schedule: 'Monday/Wednesday 11:00 AM - 12:30 PM'
    },
    {
        course_name: 'Business Management',
        schedule: 'Tuesday/Thursday 1:00 PM - 2:30 PM'
    },
    {
        course_name: 'Chemistry Basics',
        schedule: 'Monday/Wednesday 3:00 PM - 4:30 PM'
    }
];

export const seedCourses = async () => {
    try {
        // Check if courses already exist
        const existingCourses = await Course.count();
        
        if (existingCourses === 0) {
            console.log('Seeding courses...');
            await Course.bulkCreate(sampleCourses);
            console.log('Courses seeded successfully!');
        } else {
            console.log('Courses already exist, skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding courses:', error);
    }
}; 