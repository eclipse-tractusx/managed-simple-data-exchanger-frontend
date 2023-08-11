# Changelog

New features, fixed bugs, known defects and other noteworthy changes to each release of the Simple Data Exchanger Frontend.

## [2.0.9] - 2023-08-11
### Fixed
- license dependency update.
- single and multiple data offer subscribe issues.

## [2.0.8] - 2023-08-03
### Added
- removed the older charts.
- contract end date from usage policy duration.
- updated the document.
- chart releaser workflow update.
- dockerhub image push workflow update.

### Fixed
- sonarcloud reliability bug fix.

## [2.0.2] - 2023-06-30

### Added
- German text updation.
- Collapsible submodel info table section.
- Adapting latest EDC changes.
- Contact history new status name updates.
- CSV header validation while upload.

### Fixed
- Export data issue in Provider & Consumer contracts fixed.
- Select dropdown value persisting issue fixes everywhere.
- Offer details popup: duration type added.
- Error logs table row height fixes for larger data.

## [2.0.1] - 2023-05-23

### Added
- Home page - Content and design update.
- Create data page - Submodel preview and help texts added.
- Help link for app user guide in nav bar.

### Changes
- Create data page - JSON input upload option removed.

### Fixed
- Negative number entry in duration under usage policy restricted

## [2.0.0] - 2023-05-08

### Added
- Create data: Country list dropdown in manufacturing_country column.
- Descriptions for each page under title.
- Error logs of uploaded data in upload history.
- Error handling for all api calls.
- Unified BPN validation in access policy section.
- Decline contract option for provider contracts.
- App version and collapse button added in sidebar.
- Frontend document updates.
- Purpose restriction added in usage policies.

### Changes
- Upload history page table component revamped.
- Role, custom usage policies removed.
- Table row design, titles and Status column design modified.

### Fixed
- German translation missing texts added.
- File extension validation while drag and drop.
- User guide link updated in home page.
- Persisting selected value in select submodel dropdown.

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
- Created user guidance and installation documentation

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
- Integrated Keycloak
- Batch submodel upload implementation.
- Integrated contract offer listing.
- added usage policies

## [1.1.0] - 2022-08-24

### Added
- Data is uploaded via two CSV-files and Parsing of CSV file for Parts and Relationships
- The DFT registers the data in the Digital Twin Registry and makes it accessible via an EDC
- Compliance with Catena-X Guidelines
- Integration with Digital Twin registry service.

[unreleased]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.8...main
[2.0.3]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.2...dftfrontend-2.0.8
[2.0.2]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.1...dftfrontend-2.0.2
[2.0.1]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.0...dftfrontend-2.0.1
[2.0.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.9.0...dftfrontend-2.0.0
[1.9.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.8.1...dftfrontend-1.9.0
[1.8.1]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.8.0...dft-frontend-1.8.1
[1.8.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.7.0...dft-frontend-1.8.0
[1.7.0]: https://github.com/eclipse-tractusx/dft-frontend/releases/tag/dft-frontend-1.7.0
