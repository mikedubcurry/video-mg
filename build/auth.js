import users from "./users.json" assert { type: "json" };
export function checkAuth(username, password) {
    return (users.filter((user) => {
        console.log(user, username, password);
        return user.username === username && user.password === password;
    }).length === 1);
}