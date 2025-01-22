# Weather API

This repository contains a Weather API project that provides weather information for different locations. The API fetches data from a third-party weather service and presents it in a user-friendly format.

NOTE: Please disable system's firewall.
## Features

- Fetch current weather data for a specific location
- Retrieve weather forecasts for the next few days
- Support for multiple locations
- Easy-to-use API endpoints
- Display Air Quality Index (AQI) data
- Save and load recent cities from local storage

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/weatherApi.git
    ```
2. Navigate to the project directory:
    ```sh
    cd weatherApi
    ```
3. Install the required dependencies:
    ```sh
    npm install
    ```

## Usage

1. Start the server:
    ```sh
    npm start
    ```
2. Access the API endpoints at `http://localhost:3000`.

## API Endpoints

- `GET /weather/current?location={location}`: Get current weather data for the specified location.
- `GET /weather/forecast?location={location}`: Get weather forecast for the next few days for the specified location.

## Configuration

- Update the `config.js` file with your API key from the third-party weather service.

## Untracking and Removing a Folder

To untrack a folder from Git and remove it from the remote repository, follow these steps:

1. Untrack the folder:
    ```sh
    git rm -r --cached path/to/folder
    ```
2. Commit the changes:
    ```sh
    git commit -m "Untrack and remove folder from repository"
    ```
3. Push the changes to the remote repository:
    ```sh
    git push origin main
    ```

Replace `path/to/folder` with the actual path to the folder you want to untrack and remove.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact [your email](mailto:veterantyro@gmail.com).
