interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

class AuthPage {

    private readonly form: HTMLFormElement;
    private readonly usernameInput: HTMLInputElement;
    private readonly passwordInput: HTMLInputElement;
    private readonly loginButton: HTMLButtonElement;
    private readonly authModeToggle: HTMLAnchorElement;
    private readonly forgotPasswordButton: HTMLAnchorElement;

    public constructor() {
        this.form = document.querySelector(".login__form")!;
        this.usernameInput = this.form.querySelectorAll("input")[0] as HTMLInputElement;
        this.passwordInput = this.form.querySelectorAll("input")[1] as HTMLInputElement;
        this.loginButton = this.form.querySelector("button")!;

        let loginLinks: HTMLElement = document.querySelector(".login__links") as HTMLElement;

        this.forgotPasswordButton = loginLinks.children[0] as HTMLAnchorElement;
        this.authModeToggle = loginLinks.children[1] as HTMLAnchorElement;
        
        this.initialize();
    }

    private initialize(): void {

        this.form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.action();
        });

        this.authModeToggle.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            
            const emailGroup = document.querySelector<HTMLElement>(".input-group--email");
            
            emailGroup?.classList.toggle("is-visible");
            
            if (emailGroup?.classList.contains("is-visible")) {
                this.authModeToggle.textContent = "Login";
            } else {
                this.authModeToggle.textContent = "Create account";
            }

        });

        this.forgotPasswordButton.addEventListener("click", async (event: Event) => {
            event.preventDefault();
            
            const usernameGroup = document.querySelector<HTMLElement>(".input-group--username");
            const emailGroup = document.querySelector<HTMLElement>(".input-group--email");
            const passwordGroup = document.querySelector<HTMLElement>(".input-group--password");
            
            emailGroup?.classList.add("is-visible");

            passwordGroup?.classList.remove("is-visible");
            usernameGroup?.classList.remove("is-visible");

            this.loginButton.innerText = "RECOVER";

            let loginLinks: HTMLElement = document.querySelector(".login__links") as HTMLElement;
            loginLinks.style.display = "none";
            
        });
    }

    private async action(): Promise<void> {

        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value;

        if (!username || !password) {
            alert("Please fill all fields.");
            return;
        }

        this.loginButton.disabled = true;
        this.loginButton.textContent = "AUTHENTICATING...";

        const request: LoginRequest = {
            username,
            password
        };

        try {

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                throw new Error("Invalid credentials.");
            }

            const data: LoginResponse = await response.json();

            localStorage.setItem("access_token", data.token);

            console.log("Authorized successfully.");

            window.location.href = "/dashboard.html";

        } catch (error) {

            console.error(error);
            alert("Authorization failed.");

        } finally {

            this.loginButton.disabled = false;
            this.loginButton.textContent = "ACCESS SYSTEM";

        }
    }
}

new AuthPage();