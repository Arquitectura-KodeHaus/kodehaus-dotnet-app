# Backend Web API Documentation

This is the backend part of the web application, built using .NET. It serves as the API that the frontend Angular application communicates with.

## Project Structure

- **Controllers**: Contains the API controllers that handle incoming HTTP requests.
  - `ApiController.cs`: Main controller for handling API endpoints.

- **Models**: Contains the data models used in the application.
  - `SampleModel.cs`: Represents the data structure used in the application.

- **Services**: Contains the business logic and data access methods.
  - `DataService.cs`: Provides methods for data manipulation and retrieval.

- **Program.cs**: Entry point of the application, sets up the web host and runs the application.

- **Startup.cs**: Configures services and the request pipeline, including middleware and routing.

- **appsettings.json**: Configuration settings for the application, such as connection strings and application settings.

- **backend.csproj**: Project file specifying dependencies and project settings.

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   ```

2. **Navigate to the backend directory**:
   ```
   cd backend
   ```

3. **Restore dependencies**:
   ```
   dotnet restore
   ```

4. **Run the application**:
   ```
   dotnet run
   ```

The API will be available at `http://localhost:5000` (or the port specified in `launchSettings.json`).

## API Endpoints

- **GET /api/sample**: Retrieves a sample data.
- **POST /api/sample**: Creates a new sample data entry.

## Testing

Ensure that the frontend Angular application is running and configured to communicate with this backend API. You can test the endpoints using tools like Postman or directly from the frontend application.