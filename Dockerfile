FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

# Exponer el puerto que Render espera
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["RestauranteDB.csproj", "./"]
RUN dotnet restore "./RestauranteDB.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "RestauranteDB.csproj" -c Release -o /app/build
RUN dotnet publish "RestauranteDB.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "RestauranteDB.dll"]
