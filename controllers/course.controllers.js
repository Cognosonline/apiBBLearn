import fetch from 'node-fetch';

const getCourse = async (req, res) => {

    const courseId = req.params.id;
    console.log(courseId)
    const authUser = req.headers.authorization;
    const url = `${process.env.URL}/v3/courses/${courseId}`;

    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        })

        const data = await response.json();
        console.log(data)

        try {
            const urlGrandbook = `${process.env.URL}/v2/courses/${courseId}/gradebook/columns/finalGrade/users`;

            const responseGrandbook = await fetch(urlGrandbook, {
                method: 'GET',
                headers: {
                    'Authorization': authUser 
                }
            })

            const dataStudents = await responseGrandbook.json();
            console.log(dataStudents)
            
            const arrStudents = await Promise.all(dataStudents.results.map(async (element) => {

                const urlC = `${process.env.URL}/v1/users/`;

                try {
                    const responseStudent = await fetch(urlC + element.userId, {
                        method: 'GET',
                        headers: {
                            'Authorization': authUser
                        }
                    })

                    const studentInfo = await responseStudent.json();

                    return {
                        user: {
                            id: studentInfo.id,
                            externalId: studentInfo.externalId,
                            institutionRoleIds: studentInfo.institutionRoleIds,
                            name: studentInfo.name.given + " " + (studentInfo.name.middle ? studentInfo.name.middle : "") + " " + studentInfo.name.family
                        },
                        score: (element.displayGrade ? element.displayGrade : 0)
                    }

                } catch (e) {
                    console.log(e)

                }

            }));

            res.json({
                payload: {
                    course: {
                        id: data.id,
                        courseId: data.courseId,
                        externalAccessUrl: data.externalAccessUrl,
                        name: data.name,
                        idCourse: courseId
                    },
                    students: arrStudents
                }
            })

        } catch (e) {


           // console.log('libro de califiaciones vacio');
            res.json({
                payload: {
                    course: {
                        id: data.id,
                        courseId: data.courseId,
                        externalAccessUrl: data.externalAccessUrl,
                        name: data.name,
                        idCourse: courseId
                    },
                    students: null
                }
            })


        }

    } catch (error) {
        console.log(error)
    }
}

const getCourses = async (req, res) => {

    const userId = `userName:${req.params.id}`
 
    
    let authUser = req.headers.authorization;

    const url = `${process.env.URL}/v1/users/${userId}/courses`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authUser
            }
        })

        const data = await response.json();

        const courses = data.results
     

        const arrCourses = await Promise.all(courses.map(async (element) => {

            const urlC = `${process.env.URL}/v3/courses/`

            try {
                const responseCourses = await fetch(urlC + element.courseId, {
                    method: 'GET',
                    headers: {
                        'Authorization': authUser
                    }
                })

                const courseInfo = await responseCourses.json();

                return {
                    courseInfo: courseInfo,
                    role: element.courseRoleId
                }

            } catch (e) {
                console.log(e)
            }

        }));

        res.json({
            payload: arrCourses
        });

    } catch (e) {
        console.log(e)
    }
}

/*const getGradeBook = async (req, res) => {
    
    const courseId = req.params.id;
    const authUser = `Bearer ${req.session.accessToken}`;
    const url = `${process.env.URL}/v2/courses/${courseId}/gradebook/columns`;

    try {
        const response = await fetch(url,{
            method:'GET',
            headers: {
                'Authorization': authUser
            }
        });

        const data = await response.json();

        res.json({
            payload: data
        });
        
    } catch (error) {
        console.log(error)
    }

}*/

export { getCourse, getCourses }