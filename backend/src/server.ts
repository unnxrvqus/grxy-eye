import http from "node:http";
import os from "node:os";

const PORT = 3000;

const server = http.createServer(
    (req, res) => {

        console.log(req.method);
        console.log(req.url);

        if (
            req.url === "/api/auth/login" &&
            req.method === "POST"
        ) {

            res.writeHead(200, {
                "Content-Type": "application/json"
            });


            res.end(
                JSON.stringify({
                    server: os.hostname(),
                    answer: "Login stub works correctly",
                    cookie: "Psevdo-cookie"
                })
            );


            return;
        }



        res.writeHead(404);

        res.end("Not found");

    }
);



server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `Server started on ${PORT}`
    );

});