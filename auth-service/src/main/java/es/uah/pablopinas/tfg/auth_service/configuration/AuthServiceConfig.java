package es.uah.pablopinas.tfg.auth_service.configuration;

import es.uah.pablopinas.tfg.auth_service.application.port.out.LoadUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.SaveUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.TokenPort;
import es.uah.pablopinas.tfg.auth_service.application.service.AuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthServiceConfig {

    @Bean
    public AuthService authService(
            LoadUserPort loadUserPort,
            SaveUserPort saveUserPort,
            TokenPort tokenPort,
            PasswordEncoder passwordEncoder) {
        return new AuthService(loadUserPort, saveUserPort, tokenPort, passwordEncoder);
    }
}
