/*
 * Copyright (C) 2025 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import React, {useCallback, useRef, useEffect} from 'react'
import {debounce} from '@instructure/debounce'
import {Flex} from '@instructure/ui-flex'
import {Heading} from '@instructure/ui-heading'
import {IconButton} from '@instructure/ui-buttons'
import {IconArrowOpenDownLine, IconArrowOpenUpLine} from '@instructure/ui-icons'
import {View} from '@instructure/ui-view'
import {Text} from '@instructure/ui-text'
import ModuleHeaderStatusIcon from './ModuleHeaderStatusIcon'
import {ModuleProgression, CompletionRequirement, ModuleStatistics} from '../utils/types'
import {useScope as createI18nScope} from '@canvas/i18n'
import ModuleProgressionStatusBar from './ModuleProgressionStatusBar'
import {ModuleHeaderSupplementalInfoStudent} from './ModuleHeaderSupplementalInfoStudent'
import {ModuleHeaderCompletionRequirement} from './ModuleHeaderCompletionRequirement'
import {ModuleHeaderMissingCount} from './ModuleHeaderMissingCount'

const I18n = createI18nScope('context_modules_v2')

export interface ModuleHeaderStudentProps {
  id: string
  name: string
  expanded: boolean
  onToggleExpand: (id: string) => void
  progression?: ModuleProgression
  completionRequirements?: CompletionRequirement[]
  requirementCount?: number
  submissionStatistics?: ModuleStatistics
}

const ModuleHeaderStudent: React.FC<ModuleHeaderStudentProps> = ({
  id,
  name,
  expanded,
  onToggleExpand,
  progression,
  completionRequirements,
  requirementCount,
  submissionStatistics,
}) => {
  const debouncedToggleExpandRef = useRef<() => void>()

  useEffect(() => {
    debouncedToggleExpandRef.current = debounce(() => {
      onToggleExpand(id)
    }, 500)
    return () => {}
  }, [onToggleExpand, id])

  const onToggleExpandRef = useCallback(() => {
    if (debouncedToggleExpandRef.current) debouncedToggleExpandRef.current()
  }, [])

  const missingCount = submissionStatistics?.missingAssignmentCount || 0

  const hasCompletionRequirements = completionRequirements && completionRequirements.length > 0

  const showMissingCount =
    missingCount > 0 && (!progression?.completed || !hasCompletionRequirements)

  return (
    <View as="div" background="transparent">
      <Flex padding="small" justifyItems="space-between" direction="row">
        <Flex.Item>
          {progression && (completionRequirements?.length || progression.locked) ? (
            <ModuleHeaderStatusIcon progression={progression} />
          ) : null}
        </Flex.Item>
        <Flex.Item shouldGrow margin="0 0 0 small">
          <Flex justifyItems="space-between" direction="column">
            <Flex.Item>
              <Flex gap="small" alignItems="center" justifyItems="end">
                <Flex.Item shouldShrink>
                  <Heading level="h3">
                    <Text size="large" wrap="break-word">
                      {name}
                    </Text>
                  </Heading>
                </Flex.Item>
                <Flex.Item shouldGrow margin="0 medium 0 0">
                  <Flex justifyItems="end" gap="small">
                    {showMissingCount && (
                      <Flex.Item>
                        <ModuleHeaderMissingCount submissionStatistics={submissionStatistics} />
                      </Flex.Item>
                    )}
                    {hasCompletionRequirements && (
                      <Flex.Item>
                        <ModuleHeaderCompletionRequirement requirementCount={requirementCount} />
                      </Flex.Item>
                    )}
                  </Flex>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item overflowX="hidden" overflowY="hidden" margin="small 0 0 0">
              <ModuleHeaderSupplementalInfoStudent submissionStatistics={submissionStatistics} />
            </Flex.Item>
            {completionRequirements?.length && (
              <Flex.Item>
                <ModuleProgressionStatusBar
                  requirementCount={requirementCount}
                  completionRequirements={completionRequirements}
                  progression={progression}
                />
              </Flex.Item>
            )}
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <IconButton
            data-testid="module-header-expand-toggle"
            size="small"
            withBorder={false}
            screenReaderLabel={expanded ? I18n.t('Collapse module') : I18n.t('Expand module')}
            renderIcon={expanded ? IconArrowOpenDownLine : IconArrowOpenUpLine}
            withBackground={false}
            onClick={onToggleExpandRef}
          />
        </Flex.Item>
      </Flex>
    </View>
  )
}

export default ModuleHeaderStudent
