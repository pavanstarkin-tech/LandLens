import json
import codecs

with codecs.open(r"c:\Users\shese\Desktop\LandLense\cf-config.json", "r", encoding="utf-16") as f:
    data = json.load(f)

# Extract ETag and DistributionConfig
etag = data["ETag"]
dist_config = data["DistributionConfig"]

# Add new Origin
new_origin = {
    "Id": "ALB-landlens-production-alb",
    "DomainName": "landlens-production-alb-1919392235.ap-south-1.elb.amazonaws.com",
    "OriginPath": "",
    "CustomHeaders": {
        "Quantity": 0,
        "Items": []
    },
    "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only",
        "OriginSslProtocols": {
            "Quantity": 3,
            "Items": [
                "TLSv1",
                "TLSv1.1",
                "TLSv1.2"
            ]
        },
        "OriginReadTimeout": 30,
        "OriginKeepaliveTimeout": 5
    },
    "ConnectionAttempts": 3,
    "ConnectionTimeout": 10,
    "OriginShield": {
        "Enabled": False
    },
    "OriginAccessControlId": ""
}

dist_config["Origins"]["Items"].append(new_origin)
dist_config["Origins"]["Quantity"] = len(dist_config["Origins"]["Items"])

# Add new Cache Behavior
# AWS Managed Cache Policy for CachingDisabled: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
# AWS Managed Origin Request Policy for AllViewer: 216adef6-5c7f-47e4-b340-823158c56b8e

new_behavior = {
    "PathPattern": "/api/*",
    "TargetOriginId": "ALB-landlens-production-alb",
    "TrustedSigners": {
        "Enabled": False,
        "Quantity": 0,
        "Items": []
    },
    "TrustedKeyGroups": {
        "Enabled": False,
        "Quantity": 0,
        "Items": []
    },
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
        "Quantity": 7,
        "Items": [
            "HEAD",
            "DELETE",
            "POST",
            "GET",
            "OPTIONS",
            "PUT",
            "PATCH"
        ],
        "CachedMethods": {
            "Quantity": 2,
            "Items": [
                "HEAD",
                "GET"
            ]
        }
    },
    "SmoothStreaming": False,
    "Compress": True,
    "LambdaFunctionAssociations": {
        "Quantity": 0,
        "Items": []
    },
    "FunctionAssociations": {
        "Quantity": 0,
        "Items": []
    },
    "FieldLevelEncryptionId": "",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "OriginRequestPolicyId": "216adef6-5c7f-47e4-b989-5492eafa07d3"
}

if "CacheBehaviors" not in dist_config or not dist_config["CacheBehaviors"]:
    dist_config["CacheBehaviors"] = {
        "Quantity": 0,
        "Items": []
    }
elif "Items" not in dist_config["CacheBehaviors"]:
    dist_config["CacheBehaviors"]["Items"] = []

dist_config["CacheBehaviors"]["Items"].append(new_behavior)
dist_config["CacheBehaviors"]["Quantity"] = len(dist_config["CacheBehaviors"]["Items"])

# Save modified config to UTF-8 file
with open(r"c:\Users\shese\Desktop\LandLense\cf-config-updated.json", "w", encoding="utf-8") as f:
    json.dump(dist_config, f, indent=2)

print(f"ETag: {etag}")
