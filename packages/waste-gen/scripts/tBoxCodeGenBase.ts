
/**
 * Represents the type of a message in the domain.
 */
type MsgType = "cmd" | "evt";

/**
 * Generic message structure for domain events and commands.
 * @template M The type of message ('cmd' or 'evt').
 * @template T The specific type of command or event.
 * @template D The payload data associated with the message.
 */
type Msg<M extends MsgType, T extends string, D> = {
    id: string;
    msgType: M;
    type: T;
    timestamp: number;
    correlationid: string;
    causationid: string | undefined;
    data: D;
};

/**
 * Type representing a domain command.
 * @template T The type of command.
 * @template D The payload data.
 */
export type CMD<T extends string, D> = Msg<"cmd", T, D>;

/**
 * Type representing a domain event.
 * @template T The type of event.
 * @template D The payload data.
 */
export type EVT<T extends string, D> = Msg<"evt", T, D>;

/**
 * Represents the domain trace information for tracking causation and correlation of messages.
 */
export type DomainTrace = {
    correlationid: string | undefined;
    causationid: string | undefined;
};
/**
 * A type representing an asynchronous result, which can either be a success or failure.
 * @template T The type of data returned on success.
 * @template F The type of failure message.
 */
export type AsyncResult<T, F extends string> = Promise<Result<T, F>>;

/**
 * A union type representing either a success or failure outcome.
 * @template T The type of data returned on success.
 * @template F The type of failure message.
 */
export type Result<T, F extends string> = Success<T> | Failure<F>;

/**
 * Represents a successful operation.
 * @template T The type of data returned on success.
 */
export type Success<T> = { outcome: 'success'; data: T };

/**
 * Represents a failed operation.
 * @template F The type of failure message.
 */
export type Failure<F extends string> = { outcome: 'failure'; cause: Cause<F>[] };

/**
 * Represents a failure cause.
 * @template F The type of failure message.
 */
export type Cause<F extends string> = { msg: F; data?: any };

export type SafeParse<T> = (data: T) => Result<T, SafeParseFails>
export type SafeParseFails = 'parse_error'
/**
 * Type representing possible failure messages for Core Workflows.
 */
export type CoreWfFails = SafeParseFails | string;

/**
 * Represents a Core Workflow with structured properties and functions.
 * @template C The type of the command.
 * @template iS The type of the input state.
 * @template E The type of the event produced.
 * @template oS The type of the output state.
 * @template F The type of failure messages.
 * 
 */

export type AGG<T extends string, D> = {
    _tag: T
    data: D
}

export type CoreWf<C, iA, E, oA, F extends string = CoreWfFails> = {
    cmd: C
    inputAg: iA
    outputAg: oA
    aggregate: iA | oA
    evt: E
    fails: F
    validateAggregate: SafeParse<iA | oA>
};


