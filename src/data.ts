export type UserType = {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
};

export type NewUserType = {
    age: number
    username: string
    hobbies: string[]
};

export type UserDataType = UserType[];


let userData: UserDataType = [
    {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "username": "Tom",
        "age": 5,
        "hobbies": ["cycling", "swimming"],
    },
    {
        "id": "123e4567-e89b-12d3-a456-426614175000",
        "username": "Jerry",
        "age": 3,
        "hobbies": ["reading", "cooking"],
    },
    // {
    //     "id": "123e4567-e89b-12d3-a456-426614176000",
    //     "username": "Tuffy",
    //     "age": 1,
    //     "hobbies": ["singing", "dancing"],
    // }
]

module.exports = userData;