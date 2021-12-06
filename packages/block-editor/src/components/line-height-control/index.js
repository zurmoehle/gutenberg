/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalNumberControl as NumberControl,
	TextControl,
} from '@wordpress/components';
import { ZERO } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import {
	BASE_DEFAULT_VALUE,
	RESET_VALUE,
	STEP,
	isLineHeightDefined,
} from './utils';

// TODO: Remove before merging
export function LegacyLineHeightControl( { value: lineHeight, onChange } ) {
	const isDefined = isLineHeightDefined( lineHeight );

	const handleOnKeyDown = ( event ) => {
		const { keyCode } = event;

		if ( keyCode === ZERO && ! isDefined ) {
			/**
			 * Prevents the onChange callback from firing, which prevents
			 * the logic from assuming the change was triggered from
			 * an input arrow CLICK.
			 */
			event.preventDefault();
			onChange( '0' );
		}
	};

	const handleOnChange = ( nextValue ) => {
		// Set the next value without modification if lineHeight has been defined
		if ( isDefined ) {
			onChange( nextValue );
			return;
		}

		// Otherwise...
		/**
		 * The following logic handles the initial up/down arrow CLICK of the
		 * input element. This is so that the next values (from an undefined value state)
		 * are more better suited for line-height rendering.
		 */
		let adjustedNextValue = nextValue;

		switch ( nextValue ) {
			case `${ STEP }`:
				// Increment by step value
				adjustedNextValue = BASE_DEFAULT_VALUE + STEP;
				break;
			case '0':
				// Decrement by step value
				adjustedNextValue = BASE_DEFAULT_VALUE - STEP;
				break;
		}

		onChange( adjustedNextValue );
	};

	const value = isDefined ? lineHeight : RESET_VALUE;

	return (
		<div className="block-editor-line-height-control-legacy">
			<TextControl
				autoComplete="off"
				onKeyDown={ handleOnKeyDown }
				onChange={ handleOnChange }
				label={ __( 'Line height' ) }
				placeholder={ BASE_DEFAULT_VALUE }
				step={ STEP }
				type="number"
				value={ value }
				min={ 0 }
			/>
		</div>
	);
}

export default function LineHeightControl( {
	value: lineHeight,
	onChange,
	__unstableHasLegacyStyles = true,
} ) {
	const isDefined = isLineHeightDefined( lineHeight );

	const adjustNextValue = ( nextValue, wasTypedOrPasted ) => {
		// Set the next value without modification if lineHeight has been defined
		if ( isDefined ) return nextValue;

		/**
		 * The following logic handles the initial step up/down action
		 * (from an undefined value state) so that the next values are better suited for
		 * line-height rendering. For example, the first step up should immediately
		 * go to 1.6, rather than the normally expected 0.1.
		 *
		 * Step up/down actions can be triggered by keydowns of the up/down arrow keys,
		 * or by clicking the spin buttons.
		 */
		switch ( nextValue ) {
			case `${ STEP }`:
				// Increment by step value
				return BASE_DEFAULT_VALUE + STEP;
			case '0': {
				// This means the user explicitly input '0', rather than stepped down
				// from an undefined value state
				if ( wasTypedOrPasted ) return nextValue;
				// Decrement by step value
				return BASE_DEFAULT_VALUE - STEP;
			}
			case '':
				return BASE_DEFAULT_VALUE;
			default:
				return nextValue;
		}
	};

	const stateReducer = ( state, action ) => {
		// Be careful when changing this — cross-browser behavior of the
		// `inputType` field in `input` events are inconsistent.
		// For example, Firefox emits an input event with inputType="insertReplacementText"
		// on spin button clicks, while other browsers do not even emit an input event.
		const wasTypedOrPasted = [ 'insertText', 'insertFromPaste' ].includes(
			action.payload.event.nativeEvent.inputType
		);
		state.value = adjustNextValue( state.value, wasTypedOrPasted );
		return state;
	};

	const value = isDefined ? lineHeight : RESET_VALUE;

	return (
		<div
			className={ classNames( 'block-editor-line-height-control', {
				'has-legacy-styles': __unstableHasLegacyStyles,
			} ) }
		>
			<NumberControl
				__unstableInputWidth={
					__unstableHasLegacyStyles ? '60px' : undefined
				}
				__unstableStateReducer={ stateReducer }
				onChange={ onChange }
				label={ __( 'Line height' ) }
				placeholder={ BASE_DEFAULT_VALUE }
				step={ STEP }
				value={ value }
				min={ 0 }
			/>
		</div>
	);
}
