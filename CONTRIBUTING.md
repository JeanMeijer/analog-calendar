# Contributing to Analog

Thank you for your interest in contributing to Analog! We aim to make the contribution process simple and straightforward.

## Getting Started

1. **Fork the repository**
   - Visit [Analog repository](https://github.com/jeanmeijer/analog)
   - Click the "Fork" button in the top right
   - Clone your fork locally:

     ```bash
     git clone https://github.com/YOUR-USERNAME/analog.git
     cd analog
     ```

   - Add upstream remote:

     ```bash
     git remote add upstream https://github.com/jeanmeijer/analog.git
     ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Configure environment variables**:
   Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

   Then, open the newly created `.env` file. You will find default values for `DATABASE_URL` and `BETTER_AUTH_URL`. You need to set the following:
   - `BETTER_AUTH_SECRET`: Generate a secure secret by running `openssl rand -hex 32` in your terminal.
     <br/><br/>

4. **Set up Google OAuth**:

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`:
  1. Create a Google project in the [Google Cloud Console](https://console.cloud.google.com/).
  2. Follow [step 1 in the Better Auth documentation](https://www.better-auth.com/docs/authentication/google) to set up Google OAuth credentials.
  3. Enable the Google Calendar API by visiting [Google Cloud Console APIs](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com) and enabling it for your project.
  4. Add yourself as test user:
     - Locate the Google OAuth [`Audience`](https://console.cloud.google.com/auth/audience) tab.
     - Under 'Test users', click on 'Add Users'.
     - Add your email(s) in the textbox and click on 'Save'.

5. **Set up Microsoft OAuth** (optional):

- `MICROSOFT_CLIENT_ID` and `MICROSOFT_CLIENT_SECRET`:
  1. Go to the [Microsoft Azure Portal](https://portal.azure.com/), then navigate to Microsoft Entra ID → App registrations.
  2. Register a new application and set the redirect URI (`http://localhost:3000/api/auth/callback/microsoft`).
  3. Copy the Application (client) ID and create a new client secret under Certificates & secrets.
  4. Go to API permissions, click + Add a permission, choose Microsoft Graph → Delegated permissions, and add:
     - `Calendars.Read`, `Calendars.ReadWrite`, `User.Read`, `offline_access`

6. **Initialize the application**

```bash
# Initialize the database
bun run db:push

# Start development server
bun run dev
```

## Making Changes

1. Create a new branch for your changes

   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes and test them locally

3. Commit your changes using clear [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) messages

   ```bash
   git commit -m "feat: add new feature"
   ```

4. Keep your fork up to date

   ```bash
   git fetch upstream
   git merge upstream/main
   ```

## Pull Request Process

1. Push changes to your fork

   ```bash
   git push origin feature/your-feature
   ```

2. Visit your fork on GitHub and create a Pull Request
3. Create a PR with a clear description of your changes
4. Wait for review and address any feedback

## Need Help?

If you have questions or need help, please:

- Open an issue
- Comment on the relevant issue or PR

## License

By contributing to Analog, you agree that your contributions will be licensed under its MIT License.
