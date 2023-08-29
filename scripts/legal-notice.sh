#!/bin/bash

#################################################################################
# Copyright (c) 2023 T-Systems International GmbH
# Copyright (c) 2022,2023 Contributors to the Eclipse Foundation
#
# See the NOTICE file(s) distributed with this work for additional
# information regarding copyright ownership.
#
# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# SPDX-License-Identifier: Apache-2.0
################################################################################

# Read values from package.json using jq
name=$(jq -r '.name' package.json)
license=$(jq -r '.license' package.json)

# Get commit id
commit_id=$(git rev-parse HEAD)

# Get GitHub context from environment variables
server_url=$SERVER_URL
repository=$REPOSITORY
ref=$REF_NAME

legal_notice_json='{
  "name": "'$name'",
  "repositoryPath": "'$server_url'/'$repository'",
  "license": "'$license'",
  "licensePath": "'$server_url'/'$repository'/blob/'$ref'/LICENSE",
  "noticePath": "'$server_url'/'$repository'/blob/'$ref'/NOTICE.md",
  "sourcePath": "'$server_url'/'$repository'/tree/'$ref'",
  "commitId": "'$commit_id'"
}'

echo "Final json '$legal_notice_json'" 

# Write the final result to legal-notice.json
echo "$legal_notice_json" >src/assets/about/legal-notice.json
