# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
- Uploaded submodel data update/delete.
- CX components and styleguide implementation.

## [1.7.0] - 2022-11-07
### Added
- Resource access validation for keycloak user.

### Fixed
- Restrict Log-in for C-X users only to valid SDE instance for the correct organization.

## [1.6.0] - 2022-10-31
### Added
- Added new properties into application properties files.

### Changed
- Changes in Date validation for all submodel.
- Changes for improve the exception handling.

### Removed
- Removed existing api security to access API's(Provided Keycloak Security based Authentication).

### Fixed
- Fixed bugs. 
- Fix for Sonar issues.

## [1.5.0] - 2022-10-11
### Added
- Created user guidliance and installation documentation 
- Created umbrella helm charts.
- Integrated trivy, kicks. 

### Changed 
- Updated helm charts secrets. 
- Updated jar versions. 

## [1.4.0] - 2022-09-30
### Added
- View existing contract agreements.
- Find connector instance by Company Name 

## [1.3.0] - 2022-09-21
### Added
- Subscribe and accept single and multiple contract offer. 

### Changed 
- keycloack properties file changed.

## [1.2.0] - 2022-08-29
### Added
- Integrated Keycloack 
- Batch submodel upload implementation.
- Integrated contract offer listing. 

### Changed 
- Moved helm charts from helm/ to charts.
- Created workflows. 
- added usage policies

## [1.1.0] - 2022-08-24
### Added
- Data is uploaded via two CSV-files and Parsing of CSV file for Parts and Relationships
- The DFT registers the data in the Digital Twin Registry and makes it accessible via an EDC
- Compliance with Catena-X Guidelines
- Integration with Digital Twin registry service.


[Unreleased]: https://github.com/catenax-ng/product-dft-backend/compare/dft-backend-1.7.0...main
[1.7.0]: https://github.com/catenax-ng/product-dft-frontend/compare/dft-frontend-1.6.0...dft-frontend-1.7.0
[1.6.0]: https://github.com/catenax-ng/product-dft-frontend/compare/dft-frontend-1.5.0...dft-frontend-1.6.0
[1.5.0]: https://github.com/catenax-ng/product-dft-frontend/compare/dft-frontend-1.4.0...dft-frontend-1.5.0
[1.4.0]: https://github.com/catenax-ng/product-dft-frontend/compare/dft-frontend-1.3.0...dft-frontend-1.4.0
[1.3.0]: https://github.com/catenax-ng/product-dft-frontend/compare/dft-frontend-1.2.0...dft-frontend-1.3.0
[1.2.0]: https://github.com/catenax-ng/product-dft-frontend/compare/dft-frontend-1.1.0...dft-frontend-1.2.0
