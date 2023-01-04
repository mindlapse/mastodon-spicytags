import { GetParameterCommand, GetParameterCommandOutput, SSMClient } from "@aws-sdk/client-ssm";

const client = new SSMClient({});

export const getJsonSecret = async (keyPath: string) => {
    const secret = await client.send(new GetParameterCommand({
        Name: keyPath,
        WithDecryption: true
    })).then((output: GetParameterCommandOutput) => output.Parameter?.Value)

    console.log(`ssm:getSecret(): Loaded ${keyPath}.  Secret length: ${secret?.length}`);
    return secret ? JSON.parse(secret) : undefined;
}

export const createKeyPath = (key: string) => {
    return `/${process.env.PRODUCT}/${process.env.ENV}/${key}`
}
