export type UserType = {
    id: number;
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
        "id": 22332323323223,
        "username": "Tom",
        "age": 5,
        "hobbies": ["cycling", "swimming"],
    },
    {
        "id": 223323477473223,
        "username": "Jerry",
        "age": 3,
        "hobbies": ["reading", "cooking"],
    },
    {
        "id": 2233232323323223,
        "username": "Tuffy",
        "age": 1,
        "hobbies": ["singing", "dancing"],
    }
]

module.exports = userData;