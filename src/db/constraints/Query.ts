/*
 * This file is part of the Fxp Satis Serverless package.
 *
 * (c) François Pluchino <francois.pluchino@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Constraint} from '@app/db/constraints/Constraint';
import {LooseObject} from '@app/utils/LooseObject';

/**
 * @author François Pluchino <francois.pluchino@gmail.com>
 */
export class Query
{
    private constraint: Constraint;
    private model: string|null = null;

    /**
     * Constructor.
     *
     * @param {Constraint} constraint The constraint
     * @param {string}     [model]    The model
     */
    constructor(constraint: Constraint, model?: string) {
        this.setConstraint(constraint);
        this.setModel(model ? model : null);
    }

    /**
     * Set the constraint.
     *
     * @param {Constraint} constraint
     */
    public setConstraint(constraint: Constraint): void {
        this.constraint = constraint;
    }

    /**
     * Get the constraint.
     *
     * @return {Constraint}
     */
    public getConstraint(): Constraint {
        return this.constraint;
    }

    /**
     * Set the model.
     *
     * @param {string|null} model
     */
    public setModel(model: string|null): void {
        this.model = model;
    }

    /**
     * Get the model.
     *
     * @return {string|null}
     */
    public getModel(): string|null {
        return this.model;
    }

    /**
     * @inheritDoc
     */
    public getValues(): LooseObject {
        return this.constraint.getValues();
    }
}
