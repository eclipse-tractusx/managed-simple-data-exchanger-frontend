# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

##[2.0.0] - 2023-03-27

### Added

- Purpose, role, custom usage policies removed
- Country list dropdown in manufacturing_country column
- Descriptions added for each page under title
- User can see the error logs of uploaded data in upload history page
- Error handling done for all api calls
- Unified BPN validation in access policy section
- Decline contract in provider contracts page
- Upload history page table component revamped
- Frontend document updates

### Fixed

- German translation missing texts added
- Table column titles shortened in upload history
- Table row CSS fixes
- Status texts in tables improved

## [1.9.0] - 2023-03-16

### Added

- Dynamic help page with all available submodel details and download CSV sample and template options.
- Provider contract history tab.
- Consumer contract history tab.
- Multi language support (English & German).

### Fixed

- Table sort by date issues resolved.
- Error page for restricted user instead of blank screen.

## [1.8.1] - 2022-12-26

### Added

- Home page with usecase selection and app overview.
- Search and select BPN by company name in access policy section.
- Download csv sample and template in create data page.
- Download uploaded submodel data from upload history.
- i18n setup with english.

### Fixed

- Bug fixes and enhancements
## [1.8.0] - 2022-12-12

### Added

- Provider data upload tables and JSON will render dynamically based on the submodel selection.
- New submodels added: BoMAsPlanned and PartSiteInformationAsPlanned.
- CX components and styleguide implementation.
- Uploaded submodel data update/delete.
- Some pages and sections will be visible based on the permissions user have.
- Components will be rendered based on the permissions user have.

### Fixed

- Bug fixes and enhancements

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

## [1.5.0] - 2022-10-11

### Added

- Created user guidliance and installation documentation

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
- added usage policies

## [1.1.0] - 2022-08-24

### Added

- Data is uploaded via two CSV-files and Parsing of CSV file for Parts and Relationships
- The DFT registers the data in the Digital Twin Registry and makes it accessible via an EDC
- Compliance with Catena-X Guidelines
- Integration with Digital Twin registry service.

[unreleased]: https://github.com/eclipse-tractusx/dft-frontend/compare/dftfrontend-2.0.0...main
[2.0.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.9.0...dftfrontend-2.0.0
[1.9.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.8.1...dftfrontend-1.9.0
[1.8.1]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.8.0...dft-frontend-1.8.1
[1.8.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.7.0...dft-frontend-1.8.0
[1.7.0]: https://github.com/eclipse-tractusx/dft-frontend/releases/tag/dft-frontend-1.7.0

