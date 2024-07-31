# Changelog

New features, fixed bugs, known defects and other noteworthy changes to each release of the Simple Data Exchanger Frontend.


## [2.4.3] - 2024-07-31
- docker image updated to fix vulnerability.

## [2.4.2] - 2024-07-30
- dependabot issues fix for release 24.08.
- docker build image updated to latest.

## [2.4.1] - 2024-05-24
-  Bumped version for release 24.05 to match with backend version .
  
## [2.4.0] - 2024-05-14
- Dedicated page to manage policies.
- Policies will be dynamically fetched from policy hub based on the selected/available use-cases.
- Frontend components will be dynamically rendered based on the policy type.
- New policies can be created and already created policies will be selected and modified while uploading a data.
- Re-usable page loading handlers for api calls.
- Notes and info texts added in create data page.
- Policy related documentations updated.
- Submodel version added in the select submodel dropdown

### Changed
- Upload data api implementation moved to RTK query for better performance.
- Consumer: Fetching policy information from EDC for offer details overlay
- Changes needed for EDC v0.7

## [2.3.7] - 2024-05-09 
- Bumped version for release 24.03 to match with backend version (hotfix issue in fixed backend).

## [2.3.6] - 2024-03-08
### Added
- Policy overlay descriptions.
- PCF Submodel support added
### Fixed
 - Data table pagination not working - fixed
 - Veracode vulnerability fixes
 - Missing license headers added 
 - legal information added to docker image.
 - trivy workflow steps updated.
 - PCF Documentation update
 - Download file functions code optimizations. 
 - Page layout css fixes.
 
### Known defects
- Policy table misses details of the usage policies.
- Data provider contracts overview should contain this information: kind of contracts, description, policies, information about the consumer.
- Data consumer contracts overview should contain this information: kind of contracts, description, policies, information about the provider.

## [2.3.5] - 2024-02-19
### Added
- Selected use cases section in manual upload and help page.
- Sub-model links in help page.
### Changed
- New access and usage policies added.
- Documents updated.
- Bumped version to 2.3.5 for helm charts to match with backend release.
### Fixed
- Axios library issue fixed.
- Duration restriction removed.
- Purpose policy “ID 3.1 Trace” updated.
- Framework agreement added in Usage Policy.
- Help link linked to the release tag.
- Page blank issue during navigation fixed.

## [2.3.3] -  2023-12-06
### Changed
- build base image security fix.
### Known defects
- Duration restriction need to be removed, this is not a valid policy rule.
- Purpose policy rule wrong. Instead of “ID 3.0 Trace” it must be “ID 3.1 Trace”.
- Usage Policy is missing the framework agreement, which is mandatorily needed for UseCase specific data offers.
- Help link navigates to GitHub documentation of the “main” branch. Shall be linked to the release tag.

## [2.3.2] -  2023-12-01
### Fixed
- Axios library issue fixed
### Changed
- Bumped version to 2.3.2 for helm charts to match with backend release.

## [2.3.1] -  2023-11-30
### Changed
- Bumped version to 2.3.1 for helm charts to match with backend release.

## [2.3.0] -  2023-11-29
### Changed
- Bumped version to 2.3.0 for helm charts to match with backend release.

## [2.1.0] - 2023-08-30
### Fixed
- docker base image changed .

## [2.1.0] - 2023-08-30
### Added
- warning text in access policy section.
### Fixed
- warning text updates.
- removed catena -x from browser title.
- jar file added for dependencies check workflow.
- restricted, unrestricted notes removed from heading.
- german text updates.

## [2.0.11] - 2023-08-29
### Changed 
- Docker image name changed.

## [2.0.10] - 2023-08-24
### Added
- About page added.
- script added to generate values in about page.
### Fixed
- BPN validation enhancements in consumer data page.
- Add BPN flow enhancement in provider, access policy section.
- Documentation updated.

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

[unreleased]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.4.3...main
[2.4.3]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.4.3...v2.4.3
[2.4.2]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.7...v2.3.8
[2.3.7]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.6...v2.3.7
[2.3.6]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.5...v2.3.6
[2.3.5]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.3...v2.3.5
[2.3.3]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.2...v2.3.3
[2.3.2]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.1...v2.3.2
[2.3.1]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.1.1...v2.3.0
[2.1.1]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.0.10...v2.0.11
[2.0.11]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/v2.0.10...v2.0.11
[2.0.10]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/2.0.9...v2.0.10
[2.0.9]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/2.0.8...2.0.9
[2.0.8]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.2...2.0.8
[2.0.2]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.1...dftfrontend-2.0.2
[2.0.1]: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/compare/dftfrontend-2.0.0...dftfrontend-2.0.1
[2.0.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.9.0...dftfrontend-2.0.0
[1.9.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.8.1...dftfrontend-1.9.0
[1.8.1]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.8.0...dft-frontend-1.8.1
[1.8.0]: https://github.com/eclipse-tractusx/dft-frontend/compare/dft-frontend-1.7.0...dft-frontend-1.8.0
[1.7.0]: https://github.com/eclipse-tractusx/dft-frontend/releases/tag/dft-frontend-1.7.0
