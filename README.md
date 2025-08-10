# SEM Plan Builder

A comprehensive Search Engine Marketing (SEM) plan builder that helps create structured Search, Shopping, and Performance Max campaigns with keyword analysis, bid recommendations, and downloadable reports.

## Features

- **Keyword Discovery**: Generate comprehensive keyword lists using seed keywords or website analysis
- **Campaign Structure**: Organize keywords into logical ad groups and campaign themes
- **Performance Insights**: Get detailed analytics and downloadable reports
- **Multi-Campaign Support**: Create plans for Search, Shopping, and Performance Max campaigns
- **Export Functionality**: Download keyword data, ad groups, and campaign recommendations as CSV files
- **Configuration-Driven**: Customize behavior through YAML configuration files

## Tech Stack

### Backend
- **Encore.ts**: TypeScript framework for building REST APIs
- **PostgreSQL**: Database for storing SEM plans and keyword data
- **TypeScript**: Type-safe backend development

### Frontend
- **React**: Modern UI framework
- **TypeScript**: Type-safe frontend development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built UI components
- **React Query**: Data fetching and state management
- **React Router**: Client-side routing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sem-plan-builder
```

### 2. Install Encore CLI

```bash
# Install Encore CLI globally
npm install -g @encore/cli

# Or using curl (macOS/Linux)
curl -L https://encore.dev/install.sh | bash
```

### 3. Configuration

The application uses a `config.yaml` file in the project root for configuration. If no config file is found, default values will be used.

Create a `config.yaml` file in the project root:

```yaml
# SEM Plan Builder Configuration
app:
  name: "SEM Plan Builder"
  version: "1.0.0"
  environment: "development"

campaigns:
  default_budgets:
    shopping: 1000
    search: 2000
    pmax: 1500
  conversion_rate: 0.02
  default_cpc: 3.0

keywords:
  min_search_volume: 500
  sample_keywords:
    - "digital marketing services"
    - "seo optimization"
    - "ppc advertising"
    - "social media marketing"
    - "content marketing"
    # Add more keywords as needed

analysis:
  competition_levels:
    - "LOW"
    - "MEDIUM"
    - "HIGH"
  intent_types:
    - "BRAND"
    - "CATEGORY"
    - "COMPETITOR"
    - "LOCATION"
    - "LONG_TAIL"
  theme_patterns:
    - name: "Digital Marketing Services"
      patterns: ["digital", "marketing", "online", "internet"]
    # Add more theme patterns as needed

shopping:
  product_categories:
    - "Electronics & Technology"
    - "Health & Beauty"
    # Add more categories as needed
  priority_thresholds:
    high_conversions: 10
    medium_conversions: 5
    high_cpc_threshold: 3
    medium_cpc_threshold: 5

logging:
  level: "info"
  format: "json"
```

### 4. Run the Application

```bash
# Start the development server
encore run
```

This will start both the backend API server and the frontend development server:
- Backend API: `http://localhost:4000`
- Frontend: `http://localhost:3000`

### 5. Test the System

You can test the system using the built-in test endpoints:

```bash
# Test keyword generation with current configuration
curl http://localhost:4000/sem/test/keywords

# Create comprehensive test data
curl -X POST http://localhost:4000/sem/test/create-data

# Run all test cases
curl -X POST http://localhost:4000/sem/test/run-cases

# Get sample API requests for testing
curl http://localhost:4000/sem/test/sample-requests

# Get test scenarios for manual testing
curl http://localhost:4000/sem/test/scenarios

# Clear test data when done
curl -X DELETE http://localhost:4000/sem/test/clear-data
```

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000` to access the SEM Plan Builder.

## Testing Guide

### Quick Testing with Sample Data

1. **Create Test Data**:
   ```bash
   curl -X POST http://localhost:4000/sem/test/create-data
   ```
   This creates a comprehensive test SEM plan with realistic data.

2. **View Test Plan**: Go to `http://localhost:3000/plans` to see the created test plan.

3. **Run Test Cases**:
   ```bash
   curl -X POST http://localhost:4000/sem/test/run-cases
   ```
   This runs automated tests to verify system functionality.

### Sample API Requests

The system provides sample requests for different business types:

- **Digital Marketing Agency**: Comprehensive SEM plan with diverse keywords
- **E-commerce Store**: Shopping-focused plan with product keywords
- **Local Service Business**: Location-based targeting with local keywords
- **SaaS Company**: Software-focused keywords with no shopping campaigns
- **Restaurant Chain**: Multi-location food service keywords
- **Healthcare Practice**: Medical/dental service keywords

Get all sample requests:
```bash
curl http://localhost:4000/sem/test/sample-requests
```

### Test Scenarios

The system includes comprehensive test scenarios covering:

1. **End-to-End Plan Creation**: Complete workflow testing
2. **Keyword Generation**: Various input combinations
3. **Configuration System**: Config loading and validation
4. **Database Operations**: Data integrity and relationships
5. **Budget Calculations**: Performance estimates and allocations
6. **Error Handling**: Invalid inputs and edge cases
7. **Performance Testing**: Scalability with large datasets

Get all test scenarios:
```bash
curl http://localhost:4000/sem/test/scenarios
```

### Manual Testing Steps

1. **Test Configuration**:
   - Modify `config.yaml` values
   - Restart the application
   - Verify changes are reflected in keyword generation

2. **Test Plan Creation**:
   - Use the web interface to create a new plan
   - Try different business types and budget allocations
   - Verify all components are generated correctly

3. **Test Data Export**:
   - Create a plan and view its details
   - Use the export dropdown to download CSV files
   - Verify data integrity in exported files

4. **Test Error Handling**:
   - Try creating plans with invalid data
   - Test with missing required fields
   - Verify appropriate error messages

## Configuration

The application behavior can be customized through the `config.yaml` file:

### Key Configuration Sections

- **campaigns**: Default budgets, conversion rates, and CPC settings
- **keywords**: Minimum search volume and sample keywords for generation
- **analysis**: Competition levels, intent types, and theme patterns
- **shopping**: Product categories and priority thresholds

### Configuration Loading

The system will look for configuration files in the following order:
1. `config.yaml` in project root
2. `config.yml` in project root
3. Relative paths from the backend directory

If no configuration file is found, the system will use sensible defaults and continue running.

## API Endpoints

### SEM Service (`/sem`)

#### Production Endpoints
- `POST /sem/plans` - Create a new SEM plan
- `GET /sem/plans` - List all SEM plans
- `GET /sem/plans/:id` - Get specific plan details
- `POST /sem/keywords/generate` - Generate keywords

#### Test Endpoints
- `GET /sem/test/keywords` - Test keyword generation with current config
- `POST /sem/test/create-data` - Create comprehensive test data
- `DELETE /sem/test/clear-data` - Clear all test data
- `POST /sem/test/run-cases` - Run automated test cases
- `GET /sem/test/sample-requests` - Get sample API requests
- `GET /sem/test/scenarios` - Get manual test scenarios

## Project Structure

```
sem-plan-builder/
├── config.yaml                   # Configuration file
├── backend/                      # Backend services
│   └── sem/                     # SEM service
│       ├── encore.service.ts    # Service definition
│       ├── configLoader.ts     # Configuration loader
│       ├── types.ts            # TypeScript interfaces
│       ├── db.ts               # Database configuration
│       ├── migrations/         # Database migrations
│       ├── create_plan.ts      # Create SEM plan endpoint
│       ├── get_plan.ts         # Get plan details endpoint
│       ├── list_plans.ts       # List all plans endpoint
│       ├── generate_keywords.ts # Keyword generation endpoint
│       ├── test_keywords.ts    # Test keyword generation
│       ├── test_data.ts        # Test data creation and management
│       ├── sample_requests.ts  # Sample requests and test scenarios
│       ├── keyword_generator.ts # Keyword generation logic
│       └── sem_analyzer.ts     # SEM analysis utilities
├── frontend/                    # Frontend application
│   ├── App.tsx                 # Main app component
│   ├── components/             # Reusable UI components
│   └── pages/                  # Page components
└── README.md
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- `sem_plans` - Stores SEM plan metadata
- `keywords` - Stores keyword data with search volume and competition
- `ad_groups` - Stores ad group configurations
- `search_themes` - Stores Performance Max themes
- `shopping_bids` - Stores shopping campaign bid recommendations

## Usage Guide

### Quick Start with Test Data

1. Start the application: `encore run`
2. Create test data: `curl -X POST http://localhost:4000/sem/test/create-data`
3. View plans in the web interface: `http://localhost:3000/plans`
4. Run test cases: `curl -X POST http://localhost:4000/sem/test/run-cases`

### Creating a SEM Plan

1. Navigate to "Create Plan" in the header
2. Fill in your brand website and competitor information
3. Add service locations where you operate
4. Set monthly budgets (or use defaults from config)
5. Optionally provide seed keywords (or let the system use config defaults)
6. Click "Create SEM Plan" to generate your comprehensive plan

### Viewing Plan Details

1. Go to "View Plans" to see all your created plans
2. Click on any plan to view detailed analysis including:
   - Keyword analysis with search volume and competition
   - Organized ad groups with match type recommendations
   - Performance Max themes for asset groups
   - Shopping campaign bid recommendations

### Exporting Data

Use the "Export Data" dropdown on any plan details page to download:
- Keywords CSV
- Ad Groups CSV
- Search Themes CSV
- Shopping Bids CSV
- Full Report CSV

## Development

### Adding New Features

1. **Backend**: Add new API endpoints in the `backend/sem/` directory
2. **Frontend**: Create new components in `frontend/components/` or pages in `frontend/pages/`
3. **Database**: Add new migrations in `backend/sem/migrations/`
4. **Configuration**: Update `configLoader.ts` for new config options

### Database Migrations

To add a new database migration:

1. Create a new file in `backend/sem/migrations/` with format `{number}_{description}.up.sql`
2. The migration will be automatically applied when the service starts

### Type Safety

The application maintains full type safety between frontend and backend:
- Backend types are defined in `backend/sem/types.ts`
- Frontend can import these types using `import type { ... } from '~backend/sem/types'`
- API calls are automatically typed using the generated client



# Getting Started

This project consists of an Encore application. Follow the steps below to get the app running locally.

## Prerequisites

If this is your first time using Encore, you need to install the CLI that runs the local development environment. Use the appropriate command for your system:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

You also need to have bun installed for package management. If you don't have bun installed, you can install it by running:

```bash
npm install -g bun
```

## Running the Application

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. also open your docker for the runing

incase of showing error to fetch data or bun install then follow this step
mkdir node_modules(only if node modules present in the file if not then " npm install" then" mkdir node_modules")
and icase of fetch error the login my gmail in local system (kingasta921@gmail.com password Asta#$123) then 
encore auth login  then go to the my gmail account setup give the access to it then follow the next step


3. Start the Encore development server:
   ```bash
   encore run
   ```

The backend will be available at the URL shown in your terminal (typically `http://localhost:4000`).



### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx vite dev
   ```

This will test:
- Configuration loading
- Database connectivity
- Keyword generation
- SEM analysis
- Plan creation and retrieval
- Budget calculations

### Logs

View application logs using:
```bash
encore logs
```

### Database Access

Access the database directly using:
```bash
encore db shell sem
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (including configuration changes)
5. Run test cases to ensure functionality
6. Submit a pull request

## License

This project is licensed under the MIT License.
