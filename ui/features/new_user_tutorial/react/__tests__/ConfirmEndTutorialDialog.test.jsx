/*
 * Copyright (C) 2017 - present Instructure, Inc.
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

import React from 'react'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axios from '@canvas/axios'
import moxios from 'moxios'
import ConfirmEndTutorialDialog from '../ConfirmEndTutorialDialog'

describe('ConfirmEndTutorialDialog Spec', () => {
  beforeEach(() => {
    moxios.install()
  })

  afterEach(() => {
    moxios.uninstall()
    jest.restoreAllMocks()
  })

  const defaultProps = {
    isOpen: true,
    handleRequestClose() {},
  }

  // fails in Jest, passes in QUnit
  test.skip('handleOkayButtonClick calls the proper api endpoint and data', async () => {
    const user = userEvent.setup()
    const putSpy = jest.spyOn(axios, 'put')
    const {getByRole} = render(<ConfirmEndTutorialDialog {...defaultProps} />)
    const okButton = getByRole('button', {name: /okay/i})
    await user.click(okButton)

    expect(putSpy).toHaveBeenCalledWith(
      '/api/v1/users/self/features/flags/new_user_tutorial_on_off',
      {state: 'off'},
    )
  })

  // fails in Jest, passes in QUnit
  test.skip('handleOkayButtonClick calls onSuccessFunc after calling the api', async () => {
    const user = userEvent.setup()
    const onSuccessSpy = jest
      .spyOn(ConfirmEndTutorialDialog.prototype, 'onSuccess')
      .mockImplementation(() => {})
    const {getByRole} = render(<ConfirmEndTutorialDialog {...defaultProps} />)
    const okButton = getByRole('button', {name: /okay/i})
    await user.click(okButton)

    await moxios.wait(() => {
      const request = moxios.requests.mostRecent()
      return request.respondWith({status: 200})
    })

    expect(onSuccessSpy).toHaveBeenCalled()
  })
})
